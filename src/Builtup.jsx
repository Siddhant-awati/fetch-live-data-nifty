// React dashboard that fetches option chain data every 30 seconds from Nifty-related indices
// and displays a table with bullish/bearish sentiment counts

import React, { useEffect, useState } from "react";
import "./Builtup.css";

const API_ENDPOINTS = {
  NIFTY: "https://nifty-api-data.onrender.com/api/nifty-weekly",
  BANKNIFTY: "https://nifty-api-data.onrender.com/api/bank-weekly",
  FINNIFTY: "https://nifty-api-data.onrender.com/api/fin-weekly",
  SENSEX: "https://nifty-api-data.onrender.com/api/sensex-weekly",
};

const BULLISH = [
  "Put Long Covering",
  "Put Writing",
  "Call Short Covering",
  "Call Buying",
];
const BEARISH = [
  "Call Long Covering",
  "Call Writing",
  "Put Short Covering",
  "Put Buying",
];

const getBgClass = (type) => {
  if (BEARISH.includes(type)) return "bearish";
  if (BULLISH.includes(type)) return "bullish";
  return "";
};

export default function Builtup() {
  const [sentimentMatrix, setSentimentMatrix] = useState({});

  const fetchData = async () => {
    const matrix = {};
    for (const key of Object.keys(API_ENDPOINTS)) {
      matrix[key] = {};
      [...BEARISH, ...BULLISH].forEach(
        (sentiment) => (matrix[key][sentiment] = 0)
      );
    }

    for (const key of Object.keys(API_ENDPOINTS)) {
      try {
        const res = await fetch(API_ENDPOINTS[key]);
        const data = await res.json();
        if (!data?.resultData?.opDatas) continue;

        data.resultData.opDatas.forEach((d) => {
          const cb = d.calls_builtup;
          const pb = d.puts_builtup;
          if (BEARISH.includes(cb)) matrix[key][cb]++;
          if (BEARISH.includes(pb)) matrix[key][pb]++;
          if (BULLISH.includes(cb)) matrix[key][cb]++;
          if (BULLISH.includes(pb)) matrix[key][pb]++;
        });
      } catch (err) {
        console.error("Error fetching:", key, err);
      }
    }

    // Calculate totals
    const totalRow = {};
    [...BEARISH, ...BULLISH].forEach((sentiment) => {
      totalRow[sentiment] = Object.keys(matrix).reduce(
        (sum, index) => sum + (matrix[index][sentiment] || 0),
        0
      );
    });
    matrix["TOTAL"] = totalRow;

    setSentimentMatrix(matrix);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const renderTable = (title, sentimentList) => (
    <div className="table-wrapper">
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Index</th>
            {sentimentList.map((sent) => (
              <th key={sent}>{sent}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(sentimentMatrix).map(([indexName, row]) => (
            <tr
              key={indexName}
              className={indexName === "TOTAL" ? "total-row" : ""}
            >
              <td className="index-name">{indexName}</td>
              {sentimentList.map((sent) => (
                <td key={indexName + "-" + sent} className={getBgClass(sent)}>
                  {row[sent] || 0}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Option Chain Builtup</h2>
      {renderTable("Bearish", BEARISH)}
      {renderTable("Bullish", BULLISH)}
    </div>
  );
}
