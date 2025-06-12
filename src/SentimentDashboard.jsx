import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

const SentimentDashboard = () => {
  const [data, setData] = useState({
    NIFTY: { bearish: 0, bullish: 0 },
    BANKNIFTY: { bearish: 0, bullish: 0 },
    FINNIFTY: { bearish: 0, bullish: 0 },
    SENSEX: { bearish: 0, bullish: 0 },
  });

  const API_ENDPOINTS = {
    NIFTY: "https://nifty-api-data.onrender.com/api/nifty-weekly",
    BANKNIFTY: "https://nifty-api-data.onrender.com/api/bank-weekly",
    FINNIFTY: "https://nifty-api-data.onrender.com/api/fin-weekly",
    SENSEX: "https://nifty-api-data.onrender.com/api/sensex-weekly",
  };

  const BEARISH_SENTIMENTS = [
    "Call Long Covering",
    "Call Writing",
    "Put Short Covering",
    "Put Buying",
  ];

  const BULLISH_SENTIMENTS = [
    "Put Long Covering",
    "Put Writing",
    "Call Short Covering",
    "Call Buying",
  ];

  const fetchData = async () => {
    const newData = { ...data };

    for (const index of Object.keys(API_ENDPOINTS)) {
      try {
        const response = await fetch(API_ENDPOINTS[index]);
        const jsonData = await response.json();

        let bearishCount = 0;
        let bullishCount = 0;

        jsonData.resultData.opDatas.forEach((item) => {
          if (BEARISH_SENTIMENTS.includes(item.calls_builtup)) bearishCount++;
          if (BEARISH_SENTIMENTS.includes(item.puts_builtup)) bearishCount++;
          if (BULLISH_SENTIMENTS.includes(item.calls_builtup)) bullishCount++;
          if (BULLISH_SENTIMENTS.includes(item.puts_builtup)) bullishCount++;
        });

        newData[index] = { bearish: bearishCount, bullish: bullishCount };
      } catch (error) {
        console.error(`Error fetching ${index} data:`, error);
      }
    }

    setData(newData);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const totalBearish = Object.values(data).reduce(
    (sum, item) => sum + item.bearish,
    0
  );
  const totalBullish = Object.values(data).reduce(
    (sum, item) => sum + item.bullish,
    0
  );

  return (
    <div style={{ backgroundColor: "#fff9e5", height: "450px" }}>
      <h2 className="dashboard-title">Option Chain Builtup</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{}}>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  background: "#0077b6",
                  color: "white",
                  fontSize: "1rem",
                }}
              >
                Index
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  background: "#0077b6",
                  color: "white",
                  fontSize: "1rem",
                }}
              >
                Bearish
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  background: "#0077b6",
                  color: "white",
                  fontSize: "1rem",
                }}
              >
                Bullish
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(data).map(([index, counts]) => (
              <TableRow key={index}>
                <TableCell>{index}</TableCell>
                <TableCell sx={{ backgroundColor: "#ffcdd2" }}>
                  {counts.bearish}
                </TableCell>
                <TableCell sx={{ backgroundColor: "#c8e6c9" }}>
                  {counts.bullish}
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  background: "#d7e7ff",
                  fontSize: "1rem",
                }}
              >
                Total
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  background: "#d7e7ff",
                  fontSize: "1rem",
                }}
              >
                {totalBearish}
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  background: "#d7e7ff",
                  fontSize: "1rem",
                }}
              >
                {totalBullish}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default SentimentDashboard;
