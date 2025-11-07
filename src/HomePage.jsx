import React, { useState } from "react";

const HomePage = ({ onSelectLocation }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  const availableLocations = {
    "kern county": "kern",
    kern: "kern",
    bakersfield: "kern",
  };

  const handleSearch = () => {
    const searchLower = searchTerm.toLowerCase().trim();

    if (availableLocations[searchLower]) {
      setError("");
      onSelectLocation(availableLocations[searchLower]);
    } else {
      setError(
        'Sorry, we don\'t have data for that location yet. Try "Kern County" or "Bakersfield".'
      );
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #0f172a, #1e293b)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          width: "100%",
          textAlign: "center",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "48px 40px",
            borderRadius: "16px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          }}
        >
          <h1
            style={{
              fontSize: "42px",
              fontWeight: "700",
              color: "#0f172a",
              marginBottom: "12px",
              letterSpacing: "-0.02em",
            }}
          >
            🏘️ Flipper Leaderboard
          </h1>
          <p
            style={{
              fontSize: "18px",
              color: "#64748b",
              marginBottom: "40px",
              lineHeight: "1.6",
            }}
          >
            Track real estate investor activity in your area
          </p>

          <div style={{ marginBottom: "24px", textAlign: "left" }}>
            <h2
              style={{
                fontSize: "15px",
                fontWeight: "600",
                color: "#475569",
                marginBottom: "12px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Where do you want to see flip activity?
            </h2>

            <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter city, county, or zip code..."
                style={{
                  flex: 1,
                  padding: "14px 16px",
                  fontSize: "15px",
                  border: "2px solid #e2e8f0",
                  borderRadius: "8px",
                  outline: "none",
                  transition: "all 0.2s",
                  fontFamily: "inherit",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#2563eb";
                  e.target.style.boxShadow = "0 0 0 3px rgba(37, 99, 235, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.boxShadow = "none";
                }}
              />
              <button
                onClick={handleSearch}
                style={{
                  padding: "14px 28px",
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "15px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#1d4ed8";
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(37, 99, 235, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#2563eb";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                Search
              </button>
            </div>

            {error && (
              <div
                style={{
                  padding: "12px",
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: "6px",
                  marginTop: "12px",
                }}
              >
                <p
                  style={{
                    color: "#dc2626",
                    fontSize: "14px",
                    margin: 0,
                  }}
                >
                  {error}
                </p>
              </div>
            )}

            <p
              style={{
                fontSize: "13px",
                color: "#94a3b8",
                marginTop: "16px",
                textAlign: "center",
              }}
            >
              Currently available: <strong>Kern County, Bakersfield</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
