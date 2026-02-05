import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
