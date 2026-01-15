import React, { useState, useEffect } from "react";
import axios from "axios";
import HomePage from "./HomePage";

const App = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedSeller, setExpandedSeller] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [sortBy, setSortBy] = useState("flips");

  const SHEET_ID = "1Of2VnSZ-9FY-8UEyUXTWg9DEqO4CbvXRATl_qGs0AAE";

  useEffect(() => {
    if (selectedLocation) {
      fetchSheetData();
    }
  }, [selectedLocation]);

  const fetchSheetData = async () => {
    try {
      const response = await axios.get(
        `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`
      );

      const jsonString = response.data.substring(47).slice(0, -2);
      const json = JSON.parse(jsonString);

      const rows = json.table.rows;
      const headers = json.table.cols.map((col) => col.label);

      const formattedData = rows.slice(1).map((row) => {
        const rowData = {};
        row.c.forEach((cell, index) => {
          rowData[headers[index]] = cell ? cell.v : null;
        });
        return rowData;
      });

      setData(formattedData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const getLeaderboardData = () => {
    const sellerMap = new Map();

    data.forEach((property) => {
      const seller = property["Purchase Seller"] || "Unknown";

      if (!sellerMap.has(seller)) {
        sellerMap.set(seller, {
          name: seller,
          properties: [],
          flipCount: 0,
          totalVolume: 0,
          totalMargin: 0,
        });
      }

      const sellerData = sellerMap.get(seller);
      sellerData.properties.push(property);
      sellerData.flipCount++;

      const salePrice = parseFloat(property["Purchase Amt"]) || 0;
      const priceChange = parseFloat(property["Purchase Amt Change $"]) || 0;
      const purchasePrice = salePrice - priceChange;

      sellerData.totalVolume += salePrice;
      if (salePrice > 0 && purchasePrice > 0) {
        sellerData.totalMargin += salePrice - purchasePrice;
      }
    });

    const sellers = Array.from(sellerMap.values());

    if (sortBy === "volume") {
      return sellers.sort((a, b) => b.totalVolume - a.totalVolume);
    } else if (sortBy === "margin") {
      return sellers.sort((a, b) => {
        const avgMarginA = a.flipCount > 0 ? a.totalMargin / a.flipCount : 0;
        const avgMarginB = b.flipCount > 0 ? b.totalMargin / b.flipCount : 0;
        return avgMarginB - avgMarginA;
      });
      return sellers.sort((a, b) => avgMarginB - avgMarginA);
    } else {
      return sellers.sort((a, b) => b.flipCount - a.flipCount);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const toggleExpanded = (sellerName) => {
    setExpandedSeller(expandedSeller === sellerName ? null : sellerName);
  };

  if (!selectedLocation) {
    return <HomePage onSelectLocation={setSelectedLocation} />;
  }
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <h2>Loading flipper data...</h2>
      </div>
    );
  }

  const leaderboardData = getLeaderboardData();

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom right, var(--color-bg), var(--color-border))",
        padding: "24px",
      }}
    >
      <div style={{ width: "100%" }}>
        {" "}
        {/* Changed from 1280px */}
        <div style={{ marginBottom: "32px" }}>
          <button
            className="btn btn-outline"
            onClick={() => setSelectedLocation(null)}
            style={{
              padding: "8px 16px",
              fontSize: "14px",
              marginBottom: "16px",
            }}
          >
            ← Back to Home
          </button>
          <h1
            style={{
              fontSize: "36px",
              fontWeight: "bold",
              color: "var(--color-text)",
              marginBottom: "8px",
            }}
          >
            📊 Bakersfield Flipper Leaderboard
          </h1>
          <p style={{ fontSize: "18px", color: "var(--color-text-muted)" }}>
            Top real estate investors ranked by flip activity
          </p>
          <p
            style={{
              fontSize: "14px",
              color: "var(--color-text-subtle)",
              marginTop: "4px",
            }}
          >
            Data: October 2025 • Kern County, CA
          </p>
        </div>
        <div
          style={{
            background: "var(--color-surface)",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background:
                "linear-gradient(to right, var(--color-primary), var(--color-primary-dark))",
              padding: "16px 24px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "80px 3fr 140px 200px 200px",
                gap: "16px",
                color: "white",
                fontWeight: "600",
                fontSize: "14px",
              }}
            >
              <div style={{ textAlign: "center" }}>Rank</div>
              <div>Investor / Company</div>
              <div
                onClick={() => setSortBy("flips")}
                style={{
                  textAlign: "right",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: "4px",
                  userSelect: "none",
                }}
              >
                Flips {sortBy === "flips" && "↓"}
              </div>
              <div
                onClick={() => setSortBy("volume")}
                style={{
                  textAlign: "right",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: "4px",
                  userSelect: "none",
                }}
              >
                Total Volume {sortBy === "volume" && "↓"}
              </div>
              <div
                onClick={() => setSortBy("margin")}
                style={{
                  textAlign: "right",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: "4px",
                  userSelect: "none",
                }}
              >
                Avg Margin {sortBy === "margin" && "↓"}
              </div>
            </div>
          </div>

          <div>
            {leaderboardData.map((seller, index) => {
              const isExpanded = expandedSeller === seller.name;
              const avgMargin =
                seller.flipCount > 0
                  ? seller.totalMargin / seller.flipCount
                  : 0;

              return (
                <div key={seller.name}>
                  <div
                    onClick={() => toggleExpanded(seller.name)}
                    style={{
                      padding: "16px 24px",
                      borderBottom: "1px solid var(--color-border)",
                      cursor: "pointer",
                      background: isExpanded
                        ? "var(--color-bg)"
                        : "var(--color-surface)",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "var(--color-bg)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = isExpanded
                        ? "var(--color-bg)"
                        : "var(--color-surface)")
                    }
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "80px 3fr 1fr 1fr 1fr",
                        gap: "16px",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ textAlign: "center" }}>
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            fontWeight: "bold",
                            fontSize: "14px",
                            background:
                              index === 0
                                ? "#fbbf24"
                                : index === 1
                                ? "#d1d5db"
                                : index === 2
                                ? "#f59e0b"
                                : "#f1f5f9",
                            color:
                              index < 3
                                ? index === 1
                                  ? "#374151"
                                  : "white"
                                : "#64748b",
                          }}
                        >
                          {index + 1}
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: "500",
                            color: "var(--color-text)",
                          }}
                        >
                          {seller.name}
                        </span>
                        <span
                          style={{
                            fontSize: "16px",
                            color: "var(--color-text-subtle)",
                          }}
                        >
                          {isExpanded ? "▲" : "▼"}
                        </span>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "4px 12px",
                            borderRadius: "12px",
                            background: "var(--color-primary-soft)",
                            color: "#1e40af",
                            fontWeight: "600",
                          }}
                        >
                          {seller.flipCount}
                        </span>
                      </div>
                      <div
                        style={{
                          textAlign: "right",
                          fontWeight: "600",
                          color: "var(--color-text)",
                        }}
                      >
                        {formatCurrency(seller.totalVolume)}
                      </div>
                      <div
                        style={{
                          textAlign: "right",
                          fontWeight: "600",
                          color:
                            avgMargin >= 0
                              ? "var(--color-success)"
                              : "var(--color-danger)",
                        }}
                      >
                        {formatCurrency(avgMargin)}
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div
                      style={{
                        padding: "16px 24px",
                        background: "var(--color-bg)",
                        borderBottom: "1px solid var(--color-border)",
                      }}
                    >
                      <h3
                        style={{
                          fontWeight: "600",
                          marginBottom: "12px",
                          color: "var(--color-text)",
                        }}
                      >
                        Properties ({seller.properties.length})
                      </h3>
                      <div style={{ display: "grid", gap: "8px" }}>
                        {seller.properties.map((property, idx) => {
                          const salePrice =
                            parseFloat(property["Purchase Amt"]) || 0;
                          const priceChange =
                            parseFloat(property["Purchase Amt Change $"]) || 0;
                          const purchasePrice = salePrice - priceChange;

                          return (
                            <div
                              key={idx}
                              style={{
                                padding: "12px",
                                background: "var(--color-surface)",
                                borderRadius: "6px",
                                fontSize: "14px",
                              }}
                            >
                              <div
                                style={{
                                  fontWeight: "600",
                                  color: "var(--color-text)",
                                  marginBottom: "8px",
                                }}
                              >
                                {property.Address}, {property.City},{" "}
                                {property.State} {property.ZIP},{" "}
                                {property.County} County
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "8px",
                                }}
                              >
                                <div
                                  style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(4, 1fr)",
                                    gap: "8px",
                                    color: "var(--color-text-muted)",
                                  }}
                                >
                                  <div>
                                    Purchase: {formatCurrency(purchasePrice)}
                                  </div>
                                  <div>Sale: {formatCurrency(salePrice)}</div>
                                  <div>
                                    Margin: {formatCurrency(priceChange)}
                                  </div>
                                  <div>
                                    {property.Beds || "N/A"} bed •{" "}
                                    {property.Baths || "N/A"} bath •{" "}
                                    {property["Sq Ft"] || "N/A"} sqft
                                  </div>
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    gap: "8px",
                                    marginTop: "4px",
                                  }}
                                >
                                  <a
                                    href={`https://www.zillow.com/homes/${encodeURIComponent(
                                      property.Address
                                    )}-${encodeURIComponent(property.City)}-${
                                      property.State
                                    }-${property.ZIP}_rb/`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                      padding: "6px 12px",
                                      background: "var(--color-accent)",
                                      color: "var(--color-surface)",
                                      borderRadius: "4px",
                                      textDecoration: "none",
                                      fontSize: "13px",
                                      fontWeight: "600",
                                    }}
                                  >
                                    View on Zillow
                                  </a>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
