import { useEffect, useState } from "react";
import NiftyComponent from "./NiftyComponent";
import BankComponent from "./BankComponent";
import FinComponent from "./FinComponent";
import Dashboard from "./Dashboard";
import { constants } from "./constants";
import NiftyPCR from "./NiftyPCR";
import VWAP from "./VWAP";
import Builtup from "./Builtup";
import SentimentDashboard from "./SentimentDashboard";
import NiftyOptionDashboard from "./NiftyOptionDashboard";
const tempCounter = { bears: 0, bulls: 0 };

export default function App() {
  const [niftyVwapCounter, setNiftyVwapCounter] = useState(tempCounter);
  const [bankVwapCounter, setBankVwapCounter] = useState(tempCounter);
  const [finVwapCounter, setFinVwapCounter] = useState(tempCounter);
  const [niftyVwapCounterM, setNiftyVwapCounterM] = useState(tempCounter);
  const [bankVwapCounterM, setBankVwapCounterM] = useState(tempCounter);
  const [finVwapCounterM, setFinVwapCounterM] = useState(tempCounter);

  const [niftyLivePCR, setNiftyLivePCR] = useState({ total: 0, change: 0 });
  const [bankLivePCR, setBankLivePCR] = useState({ total: 0, change: 0 });
  const [finLivePCR, setFinLivePCR] = useState({ total: 0, change: 0 });

  const [latestNiftyPCR, setLatestNiftyPCR] = useState(0);
  const [latestBankPCR, setLatestBankPCR] = useState(0);
  const [latestFinPCR, setLatestFinPCR] = useState(0);

  const [intervalIndex, setIntervalIndex] = useState(0);
  const [spinner, setSpinner] = useState(false);
  const [indexData, setIndexData] = useState({
    nifty: { indexPrice: 0 },
    bank: { indexPrice: 0 },
    fin: { indexPrice: 0 },
  });

  const handleNifty = (data) => setNiftyVwapCounter(data);
  const handleBank = (data) => setBankVwapCounter(data);
  const handleFin = (data) => setFinVwapCounter(data);

  const handleNiftyLivePCR = (data) => setNiftyLivePCR(data);
  const handleBankLivePCR = (data) => setBankLivePCR(data);
  const handleFinLivePCR = (data) => setFinLivePCR(data);

  const handleLatestNiftyPCR = (data) => setLatestNiftyPCR(data);
  const handleLatestBankPCR = (data) => setLatestBankPCR(data);
  const handleLatestFinPCR = (data) => setLatestFinPCR(data);

  const handleNiftyM = (data) => setNiftyVwapCounterM(data);
  const handleBankM = (data) => setBankVwapCounterM(data);
  const handleFinM = (data) => setFinVwapCounterM(data);

  const fetchData = async () => {
    setSpinner(true);
    const temp = { nifty: {}, bank: {}, fin: {} };
    setIntervalIndex(intervalIndex + 1);

    try {
      const response = await fetch(
        "https://nifty-api-data.onrender.com/api/index-all"
      );
      const data = await response.json();
      const jsonData = data.resultData;
      if (typeof jsonData == "object" && jsonData.length > 0) {
        jsonData.filter((item) => {
          if (item["symbol_name"] == "NIFTY 50") {
            temp.nifty.indexPrice = item["last_trade_price"];
            temp.nifty.changeValue = item["change_value"];
            temp.nifty.changeValue = item["change_value"];
            temp.nifty.changePerc = item["change_per"];
            if (item["change_per"] < 0 || item["change_value"] < 0) {
              temp.nifty.tagName = "reddish";
            } else {
              temp.nifty.tagName = "greenish";
            }
          }
          if (item["symbol_name"] == "NIFTY BANK") {
            temp.bank.indexPrice = item["last_trade_price"];
            temp.bank.changeValue = item["change_value"];
            temp.bank.changeValue = item["change_value"];
            temp.bank.changePerc = item["change_per"];
            if (item["change_per"] < 0 || item["change_value"] < 0) {
              temp.bank.tagName = "reddish";
            } else {
              temp.bank.tagName = "greenish";
            }
          }
          if (item["symbol_name"] == "NIFTY FIN SERVICE") {
            temp.fin.indexPrice = item["last_trade_price"];
            temp.fin.changeValue = item["change_value"];
            temp.fin.changeValue = item["change_value"];
            temp.fin.changePerc = item["change_per"];
            if (item["change_per"] < 0 || item["change_value"] < 0) {
              temp.fin.tagName = "reddish";
            } else {
              temp.fin.tagName = "greenish";
            }
          }
        });
        setTimeout(() => {
          setSpinner(false);
        }, 1000);
        setIndexData(temp);
      }
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  };

  useEffect(() => {
    const interValConfig = setInterval(fetchData, constants.INTERVAL_TIME);
    return () => {
      clearInterval(interValConfig);
    };
  });

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h3>
        <span className="counter">{intervalIndex}</span>
      </h3>
      {spinner && <span className="loader"></span>}

      <header className="header">
        <p className="counter-title">
          <span>Weekly</span>
          <span>Monthly</span>
        </p>
        <div className="wrapper-div">
          <span className="top counter-wrapper">
            <span className="bulls">
              {" "}
              {niftyVwapCounter.bulls +
                bankVwapCounter.bulls +
                finVwapCounter.bulls}
            </span>
            <span className="bears">
              {" "}
              {niftyVwapCounter.bears +
                bankVwapCounter.bears +
                finVwapCounter.bears}
            </span>
          </span>

          <span className="top-right counter-wrapper">
            <span className="bulls">
              {" "}
              {niftyVwapCounterM.bulls +
                bankVwapCounterM.bulls +
                finVwapCounterM.bulls}
            </span>
            <span className="bears">
              {" "}
              {niftyVwapCounterM.bears +
                bankVwapCounterM.bears +
                finVwapCounterM.bears}
            </span>
          </span>
        </div>
        <table className="table table-bordered table-sm pcr-table">
          <thead>
            <tr>
              <th></th>
              <th scope="col">LIVE PCR</th>
              <th scope="col">TOTAL PCR</th>
              <th scope="col">CHANGE PCR</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="bold">NIFTY</td>
              <td className={latestNiftyPCR >= 1 ? "up" : "down"}>
                {latestNiftyPCR}
              </td>
              <td className={niftyLivePCR.total >= 1 ? "up" : "down"}>
                {niftyLivePCR.total.toFixed(4)}
              </td>
              <td className={niftyLivePCR.change >= 1 ? "up" : "down"}>
                {niftyLivePCR.change.toFixed(4)}
              </td>
            </tr>
            <tr>
              <td className="bold">BANK NIFTY</td>
              <td className={latestBankPCR >= 1 ? "up" : "down"}>
                {latestBankPCR}
              </td>
              <td className={bankLivePCR.total >= 1 ? "up" : "down"}>
                {bankLivePCR.total.toFixed(4)}
              </td>
              <td className={bankLivePCR.change >= 1 ? "up" : "down"}>
                {bankLivePCR.change.toFixed(4)}
              </td>
            </tr>
            <tr>
              <td className="bold">FIN NIFTY</td>
              <td className={latestFinPCR >= 1 ? "up" : "down"}>
                {latestFinPCR}
              </td>
              <td className={finLivePCR.total >= 1 ? "up" : "down"}>
                {finLivePCR.total.toFixed(4)}
              </td>
              <td className={finLivePCR.change >= 1 ? "up" : "down"}>
                {finLivePCR.change.toFixed(4)}
              </td>
            </tr>
          </tbody>
        </table>
      </header>
      <NiftyOptionDashboard />

      <VWAP />
      <SentimentDashboard></SentimentDashboard>

      {/* <Builtup /> */}
      <div className="accordion top" id="accordionPanelsStayOpenExample">
        <div className="accordion-item">
          <h2 className="accordion-header" id="panelsStayOpen-headingOne">
            <button
              className="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#panelsStayOpen-collapseOne"
              aria-expanded="true"
              aria-controls="panelsStayOpen-collapseOne"
            >
              NIFTY{" "}
              <span className="orange">
                {Math.floor(indexData.nifty.indexPrice)}
                <span className={indexData.nifty.tagName}>
                  <span className="blink">
                    {indexData.nifty.tagName === "greenish" && (
                      <span className="arrow">&#8593;</span>
                    )}
                    {indexData.nifty.tagName === "reddish" && (
                      <span className="arrow">&#8595;</span>
                    )}
                    {indexData.nifty.changeValue} ({indexData.nifty.changePerc}
                    %)
                  </span>
                </span>
              </span>
            </button>
            <div className="wrapper-div">
              <span className="counter-wrapper">
                <span className="bulls"> {niftyVwapCounter.bulls}</span>
                <span className="bears"> {niftyVwapCounter.bears}</span>
              </span>
              <span className="counter-wrapper right">
                <span className="bulls"> {niftyVwapCounterM.bulls}</span>
                <span className="bears"> {niftyVwapCounterM.bears}</span>
              </span>
            </div>
          </h2>
          <div
            id="panelsStayOpen-collapseOne"
            className="accordion-collapse collapse show"
            aria-labelledby="panelsStayOpen-headingOne"
          >
            <div className="accordion-body">
              <NiftyComponent
                handleNifty={handleNifty}
                handleNiftyM={handleNiftyM}
                liveNiftyIndex={indexData.nifty.indexPrice}
                handleNiftyLivePCR={handleNiftyLivePCR}
              />
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header" id="panelsStayOpen-headingTwo">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#panelsStayOpen-collapseTwo"
              aria-expanded="false"
              aria-controls="panelsStayOpen-collapseTwo"
            >
              BANK NIFTY{" "}
              <span className="orange">
                {Math.floor(indexData.bank.indexPrice)}
                <span className={indexData.bank.tagName}>
                  <span className="blink">
                    {indexData.bank.tagName === "greenish" && (
                      <span className="arrow">&#8593;</span>
                    )}
                    {indexData.bank.tagName === "reddish" && (
                      <span className="arrow">&#8595;</span>
                    )}
                    {indexData.bank.changeValue} ({indexData.bank.changePerc}%)
                  </span>
                </span>
              </span>
            </button>
            <div className="wrapper-div">
              <span className="counter-wrapper">
                <span className="bulls"> {bankVwapCounter.bulls}</span>
                <span className="bears"> {bankVwapCounter.bears}</span>
              </span>
              <span className="counter-wrapper right">
                <span className="bulls"> {bankVwapCounterM.bulls}</span>
                <span className="bears"> {bankVwapCounterM.bears}</span>
              </span>
            </div>
          </h2>
          <div
            id="panelsStayOpen-collapseTwo"
            className="accordion-collapse collapse"
            aria-labelledby="panelsStayOpen-headingTwo"
          >
            <div className="accordion-body">
              <BankComponent
                handleBank={handleBank}
                handleBankM={handleBankM}
                liveBankIndex={indexData.bank.indexPrice}
                handleBankLivePCR={handleBankLivePCR}
              />
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header" id="panelsStayOpen-headingThree">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#panelsStayOpen-collapseThree"
              aria-expanded="false"
              aria-controls="panelsStayOpen-collapseThree"
            >
              FIN NIFTY{" "}
              <span className="orange">
                {Math.floor(indexData.fin.indexPrice)}
                <span className={indexData.fin.tagName}>
                  <span className="blink">
                    {indexData.fin.tagName === "greenish" && (
                      <span className="arrow">&#8593;</span>
                    )}
                    {indexData.fin.tagName === "reddish" && (
                      <span className="arrow">&#8595;</span>
                    )}
                    {indexData.fin.changeValue} ({indexData.fin.changePerc}%)
                  </span>
                </span>
              </span>
            </button>
            <div className="wrapper-div">
              <span className="counter-wrapper">
                <span className="bulls"> {finVwapCounter.bulls}</span>
                <span className="bears"> {finVwapCounter.bears}</span>
              </span>
              <span className="counter-wrapper right">
                <span className="bulls"> {finVwapCounterM.bulls}</span>
                <span className="bears"> {finVwapCounterM.bears}</span>
              </span>
            </div>
          </h2>
          <div
            id="panelsStayOpen-collapseThree"
            className="accordion-collapse collapse"
            aria-labelledby="panelsStayOpen-headingThree"
          >
            <div className="accordion-body">
              <FinComponent
                handleFin={handleFin}
                handleFinM={handleFinM}
                liveFinIndex={indexData.fin.indexPrice}
                handleFinLivePCR={handleFinLivePCR}
              />
            </div>
          </div>
        </div>
      </div>
      {/* <NiftyPCR
        handleLatestNiftyPCR={handleLatestNiftyPCR}
        handleLatestBankPCR={handleLatestBankPCR}
        handleLatestFinPCR={handleLatestFinPCR}
      ></NiftyPCR> */}
      <Dashboard />
    </div>
  );
}
