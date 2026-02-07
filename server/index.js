import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/flips", (req, res) => {
  const data = [
    {
      seller: "Sierra Peak Holdings",
      flipCount: 4,
      totalVolume: 1245000,
      averageMargin: 62500,
      properties: [
        {
          address: "1458 Cedar St",
          city: "Bakersfield",
          state: "CA",
          zip: "93304",
          purchasePrice: 215000,
          salePrice: 285000,
          margin: 70000,
        },
        {
          address: "906 Monterey Ave",
          city: "Bakersfield",
          state: "CA",
          zip: "93308",
          purchasePrice: 175000,
          salePrice: 230000,
          margin: 55000,
        },
        {
          address: "1122 Olive Dr",
          city: "Bakersfield",
          state: "CA",
          zip: "93301",
          purchasePrice: 240000,
          salePrice: 310000,
          margin: 70000,
        },
        {
          address: "3310 L St",
          city: "Bakersfield",
          state: "CA",
          zip: "93301",
          purchasePrice: 260000,
          salePrice: 320000,
          margin: 60000,
        },
      ],
    },
    {
      seller: "Kern Valley Investors",
      flipCount: 3,
      totalVolume: 915000,
      averageMargin: 45000,
      properties: [
        {
          address: "5420 Lakewood Ct",
          city: "Bakersfield",
          state: "CA",
          zip: "93309",
          purchasePrice: 210000,
          salePrice: 255000,
          margin: 45000,
        },
        {
          address: "2801 Panorama Dr",
          city: "Bakersfield",
          state: "CA",
          zip: "93306",
          purchasePrice: 195000,
          salePrice: 240000,
          margin: 45000,
        },
        {
          address: "7617 Del Rio Ave",
          city: "Bakersfield",
          state: "CA",
          zip: "93308",
          purchasePrice: 250000,
          salePrice: 315000,
          margin: 65000,
        },
      ],
    },
    {
      seller: "Sunset Ridge Properties",
      flipCount: 2,
      totalVolume: 560000,
      averageMargin: 40000,
      properties: [
        {
          address: "1204 Brundage Ln",
          city: "Bakersfield",
          state: "CA",
          zip: "93304",
          purchasePrice: 210000,
          salePrice: 255000,
          margin: 45000,
        },
        {
          address: "4317 Belle Terrace",
          city: "Bakersfield",
          state: "CA",
          zip: "93309",
          purchasePrice: 235000,
          salePrice: 305000,
          margin: 70000,
        },
      ],
    },
  ];

  res.json({ data });
});

app.get("/api/propertyradar-test", async (req, res) => {
  const token = process.env.PROPERTY_RADAR_ACCESS_TOKEN;
  if (!token) {
    res
      .status(500)
      .json({ success: false, error: "PROPERTY_RADAR_ACCESS_TOKEN not set" });
    return;
  }

  const url = "https://api.propertyradar.com/v1/accounts/members";

  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const rawBody = await response.text();
    let body = rawBody;

    try {
      body = JSON.parse(rawBody);
    } catch (error) {
      body = rawBody;
    }

    const bodyPreview =
      typeof body === "string" ? body.slice(0, 500) : body;

    res.json({
      success: response.ok,
      status: response.status,
      body: bodyPreview,
    });
  } catch (error) {
    res.status(502).json({
      success: false,
      status: null,
      error: error.message || "Failed to reach PropertyRadar API",
    });
  }
});

app.get("/api/db-test", async (req, res) => {
  if (!process.env.DATABASE_URL) {
    res.status(500).json({ success: false, error: "DATABASE_URL not set" });
    return;
  }

  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS flips_raw (
      id BIGSERIAL PRIMARY KEY,
      source TEXT NOT NULL DEFAULT 'propertyradar',
      payload JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );`);

    const payload = { hello: "world", ts: new Date().toISOString() };
    await pool.query(
      "INSERT INTO flips_raw (payload) VALUES ($1::jsonb);",
      [payload]
    );

    const result = await pool.query(
      "SELECT * FROM flips_raw ORDER BY created_at DESC LIMIT 1;"
    );

    res.json({ success: true, inserted: true, row: result.rows[0] });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Database request failed",
    });
  }
});

app.post("/api/propertyradar/import", async (req, res) => {
  const token = process.env.PROPERTY_RADAR_ACCESS_TOKEN;
  if (!token) {
    res
      .status(500)
      .json({ success: false, error: "PROPERTY_RADAR_ACCESS_TOKEN not set" });
    return;
  }
  if (!process.env.DATABASE_URL) {
    res.status(500).json({ success: false, error: "DATABASE_URL not set" });
    return;
  }

  const listId = req.body?.listId;
  const limit = Number.isFinite(req.body?.limit) ? req.body.limit : 100;
  const offset = Number.isFinite(req.body?.offset) ? req.body.offset : 0;

  if (!listId || typeof listId !== "string") {
    res.status(400).json({ success: false, error: "listId is required" });
    return;
  }

  const url = `https://api.propertyradar.com/v1/properties?Limit=${encodeURIComponent(
    limit
  )}&Offset=${encodeURIComponent(offset)}`;
  const requestBody = {
    Criteria: [
      { name: "InList", value: listId },
      {
        name: "PurchaseDate",
        operator: "Between",
        value: ["2023-01-01", "2026-12-31"],
      },
    ],
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (response.status === 401 || response.status === 403) {
      res.status(response.status).json({
        success: false,
        error: "PropertyRadar authentication failed",
      });
      return;
    }

    if (!response.ok) {
      const errorBody = await response.text();
      res.status(response.status).json({
        success: false,
        error: "PropertyRadar request failed",
        status: response.status,
        bodyPreview: errorBody.slice(0, 500),
      });
      return;
    }

    const data = await response.json();
    const properties = Array.isArray(data?.results) ? data.results : [];

    if (properties.length === 0) {
      res.json({
        success: true,
        fetched: 0,
        inserted: 0,
        offset,
        nextOffset: offset,
      });
      return;
    }

    let inserted = 0;
    for (const property of properties) {
      await pool.query(
        "INSERT INTO flips_raw (payload) VALUES ($1::jsonb);",
        [property]
      );
      inserted += 1;
    }

    res.json({
      success: true,
      fetched: properties.length,
      inserted,
      offset,
      nextOffset: offset + properties.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "PropertyRadar import failed",
    });
  }
});

app.get("/api/propertyradar/lists", async (req, res) => {
  const token = process.env.PROPERTY_RADAR_ACCESS_TOKEN;
  if (!token) {
    res
      .status(500)
      .json({ success: false, error: "PROPERTY_RADAR_ACCESS_TOKEN not set" });
    return;
  }

  const url = "https://api.propertyradar.com/v1/lists";

  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const rawBody = await response.text();
    let body = rawBody;

    try {
      body = JSON.parse(rawBody);
    } catch (error) {
      body = rawBody;
    }

    res.status(response.status).json(body);
  } catch (error) {
    res.status(502).json({
      success: false,
      error: error.message || "Failed to reach PropertyRadar API",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
