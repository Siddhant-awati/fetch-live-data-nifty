import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Box,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Define a custom Material-UI theme for consistent styling
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#4F46E5", // Indigo 600
    },
    secondary: {
      main: "#10B981", // Emerald 500
    },
    background: {
      default: "#003049", // Gray 100
      paper: "#FFFFFF",
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "12px", // Rounded corners for Paper components
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px", // Rounded corners for buttons
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: "bold",
          backgroundColor: "#E0E7FF", // Indigo 100
          color: "#374151", // Gray 700
        },
      },
    },
  },
});

// Define the API endpoints
const API_ENDPOINTS = {
  nifty: "https://nifty-api-data.onrender.com/api/nifty-weekly",
  banknifty: "https://nifty-api-data.onrender.com/api/bank-weekly",
  finnifty: "https://nifty-api-data.onrender.com/api/fin-weekly",
  sensex: "https://nifty-api-data.onrender.com/api/sensex-weekly",
};

// Main App component
function VWAP() {
  // State to store the processed option chain data for each index
  const [optionData, setOptionData] = useState({
    nifty: null,
    banknifty: null,
    finnifty: null,
    sensex: null,
  });
  // State for loading status
  const [loading, setLoading] = useState(true);
  // State for error handling
  const [error, setError] = useState(null);

  // Function to process raw option chain data and count calls/puts relative to VWAP
  const processOptionChainData = (data) => {
    let callsLessVwap = 0;
    let callsGreaterVwap = 0;
    let putsLessVwap = 0;
    let putsGreaterVwap = 0;

    // Ensure opDatas exists and is an array before processing
    if (data && data.resultData && Array.isArray(data.resultData.opDatas)) {
      data.resultData.opDatas.forEach((entry) => {
        const callsLtp = entry.calls_ltp;
        const callsAveragePrice = entry.calls_average_price;
        const putsLtp = entry.puts_ltp;
        const putsAveragePrice = entry.puts_average_price;

        // Count Call options based on LTP vs. VWAP
        if (
          typeof callsLtp === "number" &&
          typeof callsAveragePrice === "number"
        ) {
          if (callsLtp < callsAveragePrice) {
            callsLessVwap++;
          } else if (callsLtp > callsAveragePrice) {
            callsGreaterVwap++;
          }
        }

        // Count Put options based on LTP vs. VWAP
        if (
          typeof putsLtp === "number" &&
          typeof putsAveragePrice === "number"
        ) {
          if (putsLtp < putsAveragePrice) {
            putsLessVwap++;
          } else if (putsLtp > putsAveragePrice) {
            putsGreaterVwap++;
          }
        }
      });
    }

    return { callsLessVwap, callsGreaterVwap, putsLessVwap, putsGreaterVwap };
  };

  // Function to fetch data from all endpoints
  const fetchData = async () => {
    setLoading(true); // Set loading to true before fetching
    setError(null); // Clear previous errors
    try {
      // Fetch data from all three endpoints concurrently using Promise.all
      const [niftyRes, bankniftyRes, finniftyRes, sensexRes] =
        await Promise.all([
          fetch(API_ENDPOINTS.nifty),
          fetch(API_ENDPOINTS.banknifty),
          fetch(API_ENDPOINTS.finnifty),
          fetch(API_ENDPOINTS.sensex),
        ]);

      // Check if all responses are successful
      if (!niftyRes.ok)
        throw new Error(`NIFTY API error: ${niftyRes.statusText}`);
      if (!bankniftyRes.ok)
        throw new Error(`BANKNIFTY API error: ${bankniftyRes.statusText}`);
      if (!finniftyRes.ok)
        throw new Error(`FINNIFTY API error: ${finniftyRes.statusText}`);
      if (!sensexRes.ok)
        throw new Error(`SENSEX API error: ${sensexRes.statusText}`);

      // Parse JSON responses
      const niftyData = await niftyRes.json();
      const bankniftyData = await bankniftyRes.json();
      const finniftyData = await finniftyRes.json();
      const sensexData = await sensexRes.json();

      // Process and update the state with the new data
      const processedNifty = processOptionChainData(niftyData);
      const processedBankNifty = processOptionChainData(bankniftyData);
      const processedFinNifty = processOptionChainData(finniftyData);
      const processedSensex = processOptionChainData(sensexData);

      setOptionData({
        nifty: processedNifty,
        banknifty: processedBankNifty,
        finnifty: processedFinNifty,
        sensex: processedSensex,
      });

      // Log processed data to console for debugging
      console.log("Processed NIFTY Data:", processedNifty);
      console.log("Processed BANKNIFTY Data:", processedBankNifty);
      console.log("Processed FINNIFTY Data:", processedFinNifty);
      console.log("Processed SENSEX Data:", processedSensex);
    } catch (err) {
      // Catch and set any errors during the fetch process
      console.error("Failed to fetch option chain data:", err);
      setError(err.message);
    } finally {
      setLoading(false); // Set loading to false after fetch completes (whether success or error)
    }
  };

  // useEffect hook to trigger data fetching on component mount and then every 15 seconds
  useEffect(() => {
    fetchData(); // Initial data fetch when the component mounts

    const intervalId = setInterval(fetchData, 3000000);

    // Cleanup function: This runs when the component unmounts or before the effect re-runs.
    // It's crucial to clear the interval to prevent memory leaks.
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures this effect runs only once on mount

  // Calculate total counts across all indices using useMemo for performance optimization
  const totalCounts = useMemo(() => {
    const totals = {
      callsLessVwap: 0,
      callsGreaterVwap: 0,
      putsLessVwap: 0,
      putsGreaterVwap: 0,
    };

    // Iterate over the values of optionData (nifty, banknifty, sensex data)
    Object.values(optionData).forEach((data) => {
      if (data) {
        // Ensure data exists for the current index
        totals.callsLessVwap += data.callsLessVwap;
        totals.callsGreaterVwap += data.callsGreaterVwap;
        totals.putsLessVwap += data.putsLessVwap;
        totals.putsGreaterVwap += data.putsGreaterVwap;
      }
    });
    return totals;
  }, [optionData]); // Recalculate totals whenever optionData changes

  return (
    <ThemeProvider theme={theme}>
      <h2 className="vwap">VWAP Analysis</h2>
      <CssBaseline /> {/* Provides a consistent baseline for styling */}
      <div
        style={{ height: "350px", fontSize: "16px" }}
        className="bg-gray-100 flex flex-col items-center justify-center"
      >
        <Box className="w-full max-w-4xl bg-white p-6 rounded-xl shadow-lg">
          {/* Display loading spinner and message when data is being fetched */}
          {loading && (
            <Box className="flex justify-center items-center h-48">
              <CircularProgress />
              <Typography variant="h6" className="ml-4 text-gray-600">
                Fetching data...
              </Typography>
            </Box>
          )}

          {/* Display error message if an error occurs during fetching */}
          {error && (
            <Box className="flex justify-center items-center h-48 text-red-600">
              <Typography variant="h6">Error: {error}</Typography>
            </Box>
          )}

          {/* Render the table only when not loading and no errors */}
          {!loading && !error && (
            <TableContainer
              component={Paper}
              className="rounded-lg overflow-hidden"
            >
              <Table aria-label="option chain analysis table">
                <TableHead>
                  <TableRow>
                    <TableCell
                      className="font-semibold"
                      style={{
                        backgroundColor: "#0077b6",
                        color: "white",
                      }}
                    >
                      INDEX
                    </TableCell>
                    {/* Red Columns */}
                    <TableCell
                      align="right"
                      className="font-semibold"
                      style={{
                        backgroundColor: "#0077b6",
                        color: "white",
                        textAlign: "center",
                      }}
                    >
                      CALL Writing
                    </TableCell>
                    <TableCell
                      align="right"
                      className="font-semibold"
                      style={{
                        backgroundColor: "#0077b6",
                        color: "white",
                        textAlign: "center",
                      }}
                    >
                      PUT Buying
                    </TableCell>
                    {/* Green Columns */}
                    <TableCell
                      align="right"
                      className="font-semibold"
                      style={{
                        backgroundColor: "#0077b6",
                        color: "white",
                        textAlign: "center",
                      }}
                    >
                      CALL Buying
                    </TableCell>
                    <TableCell
                      align="right"
                      className="font-semibold"
                      style={{
                        backgroundColor: "#0077b6",
                        color: "white",
                        textAlign: "center",
                      }}
                    >
                      PUT Writing
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* Map through the optionData to render rows for each index */}
                  {Object.entries(optionData).map(([indexName, data]) => (
                    <TableRow key={indexName} className="hover:bg-gray-50">
                      <TableCell
                        component="th"
                        scope="row"
                        className="capitalize font-medium"
                      >
                        {indexName.toUpperCase()}
                      </TableCell>
                      {/* Calls < VWAP (Bearish) -> Always Red background */}
                      <TableCell
                        align="right"
                        className="bg-red-100 text-red-800"
                        style={{
                          backgroundColor: "#ffdbdb",
                          textAlign: "center",
                        }}
                      >
                        {data?.callsLessVwap ?? "N/A"}
                      </TableCell>
                      {/* Puts > VWAP (Bearish) -> Always Red background */}
                      <TableCell
                        align="right"
                        className="bg-red-100 text-red-800"
                        style={{
                          backgroundColor: "#ffdbdb",
                          textAlign: "center",
                        }}
                      >
                        {data?.putsGreaterVwap ?? "N/A"}
                      </TableCell>
                      {/* Calls > VWAP (Bullish) -> Always Green background */}
                      <TableCell
                        align="right"
                        className="bg-green-100 text-green-800"
                        style={{
                          backgroundColor: "#c7ffc7",
                          textAlign: "center",
                        }}
                      >
                        {data?.callsGreaterVwap ?? "N/A"}
                      </TableCell>
                      {/* Puts < VWAP (Bullish) -> Always Green background */}
                      <TableCell
                        align="right"
                        className="bg-green-100 text-green-800"
                        style={{
                          backgroundColor: "#c7ffc7",
                          textAlign: "center",
                        }}
                      >
                        {data?.putsLessVwap ?? "N/A"}
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* Total row */}
                  <TableRow
                    className="bg-indigo-50 font-bold"
                    style={{ fontWeight: "bold" }}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      className="font-bold text-indigo-800"
                      style={{
                        fontWeight: "bold",
                        backgroundColor: "rgb(176 208 255)",
                      }}
                    >
                      TOTAL
                    </TableCell>
                    {/* Total Calls < VWAP (Bearish) -> Always Red background */}
                    <TableCell
                      align="right"
                      className="font-bold bg-red-200 text-red-900"
                      style={{
                        fontWeight: "bold",
                        backgroundColor: "rgb(176 208 255)",
                        textAlign: "center",
                      }}
                    >
                      {totalCounts.callsLessVwap}
                    </TableCell>
                    {/* Total Puts > VWAP (Bearish) -> Always Red background */}
                    <TableCell
                      align="right"
                      className="font-bold bg-red-200 text-red-900"
                      style={{
                        fontWeight: "bold",
                        backgroundColor: "rgb(176 208 255)",
                        textAlign: "center",
                      }}
                    >
                      {totalCounts.putsGreaterVwap}
                    </TableCell>
                    {/* Total Calls > VWAP (Bullish) -> Always Green background */}
                    <TableCell
                      align="right"
                      className="font-bold bg-green-200 text-green-900"
                      style={{
                        fontWeight: "bold",
                        backgroundColor: "rgb(176 208 255)",
                        textAlign: "center",
                      }}
                    >
                      {totalCounts.callsGreaterVwap}
                    </TableCell>
                    {/* Total Puts < VWAP (Bullish) -> Always Green background */}
                    <TableCell
                      align="right"
                      className="font-bold bg-green-200 text-green-900"
                      style={{
                        fontWeight: "bold",
                        backgroundColor: "rgb(176 208 255)",
                        textAlign: "center",
                      }}
                    >
                      {totalCounts.putsLessVwap}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </div>
    </ThemeProvider>
  );
}

export default VWAP;
