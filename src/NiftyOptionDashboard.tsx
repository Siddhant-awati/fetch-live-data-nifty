import React, { useState, useEffect, useRef } from "react";

interface OptionChainData {
  strike_price: number;
  calls_oi: number;
  calls_ltp: number;
  puts_oi: number;
  puts_ltp: number;
  index_close: number;
}

interface ApiResponse {
  result: number;
  resultMessage: string;
  resultData: {
    opDatas: OptionChainData[];
  };
}

interface AnalysisData {
  trend: string;
  support: number;
  resistance: number;
  suggestion: string;
  strike: number;
  target: number;
  stopLoss: number;
  lastUpdated: string;
  underlyingValue: number;
  pcr: number;
}

const NiftyOptionDashboard: React.FC = () => {
  const [analysis, setAnalysis] = useState<AnalysisData>({
    trend: "Loading...",
    support: 0,
    resistance: 0,
    suggestion: "Loading...",
    strike: 0,
    target: 0,
    stopLoss: 0,
    lastUpdated: "Never",
    underlyingValue: 0,
    pcr: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [previousTrend, setPreviousTrend] = useState<string>("");
  const [trendReversalAlert, setTrendReversalAlert] = useState<boolean>(false);
  const [blink, setBlink] = useState<boolean>(false);
  const alertTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (alertTimeoutRef.current) {
        clearTimeout(alertTimeoutRef.current);
      }
    };
  }, []);

  // Blink effect for alert
  useEffect(() => {
    let blinkInterval: NodeJS.Timeout;

    if (trendReversalAlert) {
      blinkInterval = setInterval(() => {
        setBlink((prev) => !prev);
      }, 500);
    }

    return () => {
      if (blinkInterval) clearInterval(blinkInterval);
    };
  }, [trendReversalAlert]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        "https://nifty-api-data.onrender.com/api/nifty-weekly-20"
      );
      const data: ApiResponse = await response.json();

      if (data.result !== 1 || !data.resultData?.opDatas) {
        throw new Error(data.resultMessage || "Invalid data received");
      }

      const opDatas = data.resultData.opDatas;
      if (opDatas.length === 0) {
        throw new Error("No option chain data available");
      }

      // Calculate PCR (Put-Call Ratio)
      let totalCallOI = 0;
      let totalPutOI = 0;

      opDatas.forEach((strike) => {
        totalCallOI += strike.calls_oi;
        totalPutOI += strike.puts_oi;
      });

      const pcr = totalPutOI / totalCallOI;

      // Find support (max put OI)
      const supportStrike = opDatas.reduce((max, current) =>
        current.puts_oi > max.puts_oi ? current : max
      );

      // Find resistance (max call OI)
      const resistanceStrike = opDatas.reduce((max, current) =>
        current.calls_oi > max.calls_oi ? current : max
      );

      // Determine trend
      const trend = pcr > 1.2 ? "Bearish" : pcr < 0.8 ? "Bullish" : "Neutral";

      // Check for trend reversal
      if (
        previousTrend &&
        previousTrend !== trend &&
        previousTrend !== "Loading..."
      ) {
        setTrendReversalAlert(true);
        if (alertTimeoutRef.current) {
          clearTimeout(alertTimeoutRef.current);
        }
        alertTimeoutRef.current = setTimeout(() => {
          setTrendReversalAlert(false);
          setBlink(false);
        }, 30000); // Show alert for 30 seconds
      }

      setPreviousTrend(trend);

      // Generate suggestion
      const underlying = opDatas[0].index_close;
      const sortedStrikes = [...opDatas].sort(
        (a, b) => a.strike_price - b.strike_price
      );
      const atTheMoneyIndex = sortedStrikes.findIndex(
        (s) => s.strike_price >= underlying
      );

      let suggestion = "";
      let strike = 0;
      let premium = 0;

      if (trend === "Bullish") {
        suggestion = "Buy Call";
        const index = Math.min(atTheMoneyIndex + 2, sortedStrikes.length - 1);
        strike = sortedStrikes[index].strike_price;
        premium = sortedStrikes[index].calls_ltp;
      } else if (trend === "Bearish") {
        suggestion = "Buy Put";
        const index = Math.max(atTheMoneyIndex - 2, 0);
        strike = sortedStrikes[index].strike_price;
        premium = sortedStrikes[index].puts_ltp;
      } else {
        suggestion = "Stay in Cash";
        strike = 0;
        premium = 0;
      }

      // Calculate target and stop loss
      const target = premium * 1.5;
      const stopLoss = premium * 0.7;

      setAnalysis({
        trend,
        support: supportStrike.strike_price,
        resistance: resistanceStrike.strike_price,
        suggestion,
        strike,
        target: Math.round(target * 100) / 100,
        stopLoss: Math.round(stopLoss * 100) / 100,
        lastUpdated: new Date().toLocaleTimeString(),
        underlyingValue: underlying,
        pcr: parseFloat(pcr.toFixed(2)),
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      setAnalysis((prev) => ({
        ...prev,
        trend: "Error",
        suggestion: "Failed to fetch data",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // CSS styles
  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      margin: "20px auto",
      padding: "25px",
      backgroundColor: "#fff1c9",
      borderRadius: "15px",
      boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
      position: "relative",
    },
    header: {
      textAlign: "center",
      color: "#38bdf8",
      marginBottom: "30px",
      fontSize: "28px",
      fontWeight: "700",
      textShadow: "0 2px 4px rgba(0,0,0,0.2)",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "25px",
      marginBottom: "30px",
    },
    card: {
      backgroundColor: "#1e293b",
      borderRadius: "12px",
      padding: "25px",
      boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
      textAlign: "center",
      transition: "transform 0.3s ease",
      border: "1px solid #334155",
    },
    title: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#ffc107",
      marginBottom: "15px",
      letterSpacing: "0.5px",
    },
    value: {
      fontSize: "32px",
      fontWeight: "800",
      margin: "15px 0",
      color: "#f8fafc",
    },
    bullish: {
      color: "#10b981",
      backgroundColor: "rgba(16, 185, 129, 0.1)",
      padding: "8px 15px",
      borderRadius: "25px",
      display: "inline-block",
      fontSize: "18px",
      fontWeight: "700",
    },
    bearish: {
      color: "#ef4444",
      backgroundColor: "rgba(239, 68, 68, 0.1)",
      padding: "8px 15px",
      borderRadius: "25px",
      display: "inline-block",
      fontSize: "18px",
      fontWeight: "700",
    },
    neutral: {
      color: "#94a3b8",
      backgroundColor: "rgba(148, 163, 184, 0.1)",
      padding: "8px 15px",
      borderRadius: "25px",
      display: "inline-block",
      fontSize: "18px",
      fontWeight: "700",
    },
    suggestionBuy: {
      color: "#22c55e",
      fontWeight: "700",
      fontSize: "20px",
      margin: "10px 0",
    },
    suggestionSell: {
      color: "#ef4444",
      fontWeight: "700",
      fontSize: "20px",
      margin: "10px 0",
    },
    suggestionNeutral: {
      color: "#94a3b8",
      fontWeight: "700",
      fontSize: "20px",
      margin: "10px 0",
    },
    footer: {
      textAlign: "center",
      color: "#94a3b8",
      fontSize: "14px",
      marginTop: "20px",
      padding: "15px",
      backgroundColor: "#1e293b",
      borderRadius: "8px",
    },
    loading: {
      textAlign: "center",
      padding: "30px",
      fontSize: "18px",
      color: "#94a3b8",
    },
    stat: {
      display: "flex",
      justifyContent: "space-between",
      margin: "8px 0",
      padding: "8px 0",
      borderBottom: "1px solid #334155",
      color: "#fff",
    },
    statValue: {
      fontWeight: "600",
      color: "#e2e8f0",
    },
    alertBanner: {
      position: "absolute",
      top: "0",
      left: "0",
      right: "0",
      padding: "15px",
      textAlign: "center",
      fontWeight: "700",
      fontSize: "18px",
      zIndex: "100",
      animation: "pulse 1s infinite",
    },
    reversalBullish: {
      backgroundColor: "rgba(16, 185, 129, 0.2)",
      color: "#10b981",
      borderBottom: "3px solid #10b981",
    },
    reversalBearish: {
      backgroundColor: "rgba(239, 68, 68, 0.2)",
      color: "#ef4444",
      borderBottom: "3px solid #ef4444",
    },
  };

  return (
    <div style={styles.container}>
      {/* Trend Reversal Alert Banner */}
      {trendReversalAlert && (
        <div
          style={{
            ...styles.alertBanner,
            ...(analysis.trend === "Bullish"
              ? styles.reversalBullish
              : styles.reversalBearish),
            opacity: blink ? 1 : 0.7,
            transition: "opacity 0.5s ease",
          }}
        >
          {analysis.trend === "Bullish" ? "⬆️" : "⬇️"} TREND REVERSAL ALERT!
          Market turning {analysis.trend.toLowerCase()}{" "}
          {analysis.trend === "Bullish" ? "⬆️" : "⬇️"}
        </div>
      )}

      <h1 style={styles.header}>NIFTY Options Chain Dashboard</h1>

      {isLoading ? (
        <div style={styles.loading}>Loading market data...</div>
      ) : (
        <>
          <div style={styles.grid}>
            <div style={styles.card}>
              <h2 style={styles.title}>Market Trend</h2>
              <div
                style={
                  analysis.trend === "Bullish"
                    ? styles.bullish
                    : analysis.trend === "Bearish"
                    ? styles.bearish
                    : styles.neutral
                }
              >
                {analysis.trend}
              </div>
              <div style={styles.stat}>
                <span>PCR:</span>
                <span style={styles.statValue}>{analysis.pcr}</span>
              </div>
              <div style={styles.stat}>
                <span>Underlying:</span>
                <span style={styles.statValue}>
                  ₹{analysis.underlyingValue}
                </span>
              </div>
            </div>

            <div style={styles.card}>
              <h2 style={styles.title}>Strong Support</h2>
              <div style={styles.value}>₹{analysis.support}</div>
              <p style={{ color: "#94a3b8" }}>Highest Put Open Interest</p>
              <div
                style={{
                  marginTop: "15px",
                  padding: "10px",
                  backgroundColor: "rgba(239, 68, 68, 0.05)",
                  borderRadius: "8px",
                }}
              >
                <div style={styles.stat}>
                  <span>Support Range:</span>
                  <span style={styles.statValue}>
                    ₹{analysis.support - 100} - ₹{analysis.support}
                  </span>
                </div>
              </div>
            </div>

            <div style={styles.card}>
              <h2 style={styles.title}>Strong Resistance</h2>
              <div style={styles.value}>₹{analysis.resistance}</div>
              <p style={{ color: "#94a3b8" }}>Highest Call Open Interest</p>
              <div
                style={{
                  marginTop: "15px",
                  padding: "10px",
                  backgroundColor: "rgba(16, 185, 129, 0.05)",
                  borderRadius: "8px",
                }}
              >
                <div style={styles.stat}>
                  <span>Resistance Range:</span>
                  <span style={styles.statValue}>
                    ₹{analysis.resistance} - ₹{analysis.resistance + 100}
                  </span>
                </div>
              </div>
            </div>

            <div style={styles.card}>
              <h2 style={styles.title}>Trading Suggestion</h2>
              <p
                style={
                  analysis.suggestion.includes("Call")
                    ? styles.suggestionBuy
                    : analysis.suggestion.includes("Put")
                    ? styles.suggestionSell
                    : styles.suggestionNeutral
                }
              >
                {analysis.suggestion}
              </p>

              {analysis.strike > 0 && (
                <div style={{ marginTop: "20px" }}>
                  <div style={styles.stat}>
                    <span>Strike Price:</span>
                    <span style={styles.statValue}>₹{analysis.strike}</span>
                  </div>
                  <div style={styles.stat}>
                    <span>Target Price:</span>
                    <span style={{ ...styles.statValue, color: "#22c55e" }}>
                      ₹{analysis.target}
                    </span>
                  </div>
                  <div style={styles.stat}>
                    <span>Stop Loss:</span>
                    <span style={{ ...styles.statValue, color: "#ef4444" }}>
                      ₹{analysis.stopLoss}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NiftyOptionDashboard;
