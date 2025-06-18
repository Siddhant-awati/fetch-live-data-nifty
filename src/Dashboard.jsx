import React, { useState } from "react";
import "./Dashboard.css";

const API_ENDPOINTS = {
  NIFTY: "https://nifty-api-data.onrender.com/api/nifty-weekly-20",
  SENSEX: "https://nifty-api-data.onrender.com/api/sensex-weekly-20",
  FINNIFTY: "https://nifty-api-data.onrender.com/api/fin-weekly-20",
  BANKNIFTY: "https://nifty-api-data.onrender.com/api/bank-weekly-20",
};

const getTimestamp = () => {
  const now = new Date();
  return now.toISOString().replace(/[:.]/g, "-");
};

const downloadJSON = (data, filename) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

const Dashboard = () => {
  const [loading, setLoading] = useState({});

  const fetchData = async (label, url) => {
    try {
      setLoading((prev) => ({ ...prev, [label]: true }));
      const res = await fetch(url);
      const data = await res.json();
      const timestamp = getTimestamp();
      downloadJSON(data, `${label}-${timestamp}.json`);
    } catch (error) {
      console.error(`Error fetching ${label} data:`, error);
    } finally {
      setLoading((prev) => ({ ...prev, [label]: false }));
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Download Option Chain</h1>
      <div className="dashboard-grid">
        {Object.entries(API_ENDPOINTS).map(([label, url]) => (
          <div key={label} className="dashboard-card">
            <button
              onClick={() => fetchData(label, url)}
              disabled={loading[label]}
              className="dashboard-button"
            >
              {loading[label] ? `Downloading...` : `Download ${label}`}
            </button>
          </div>
        ))}
      </div>
      <div className="scroll-top-container">
        <button onClick={scrollToTop} className="scroll-top-button">
          Scroll to Top
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
