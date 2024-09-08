import { useEffect, useState } from "react";
import axios from 'axios';
import NiftyComponent from './NiftyComponent';
import BankComponent from './BankComponent';
import FinComponent from './FinComponent';
import { constants } from './constants';

const tempCounter = { bears: 0, bulls: 0 }
export default function App() {
  const [niftyVwapCounter, setNiftyVwapCounter] = useState(tempCounter);
  const [bankVwapCounter, setBankVwapCounter] = useState(tempCounter);
  const [finVwapCounter, setFinVwapCounter] = useState(tempCounter);
  const [niftyVwapCounterM, setNiftyVwapCounterM] = useState(tempCounter);
  const [bankVwapCounterM, setBankVwapCounterM] = useState(tempCounter);
  const [finVwapCounterM, setFinVwapCounterM] = useState(tempCounter);
  
  const [intervalIndex, setIntervalIndex] = useState(0);
  const [spinner, setSpinner] = useState(false);
  const [indexData, setIndexData] = useState({
    niftyIndex: 0,
    bankIndex: 0,
    finIndex: 0
  });

  const handleNifty = (data) => setNiftyVwapCounter(data);
  const handleBank = (data) => setBankVwapCounter(data);
  const handleFin = (data) => setFinVwapCounter(data);

  const handleNiftyM = (data) => setNiftyVwapCounterM(data);
  const handleBankM = (data) => setBankVwapCounterM(data);
  const handleFinM = (data) => setFinVwapCounterM(data);

  const getIndexData = () => {
    setSpinner(true);
    const filePath = './src/DATA/index' + intervalIndex + '.txt';
    const temp = {}
    setIntervalIndex(intervalIndex + 1);
    axios.get(filePath)
      .then(res => {
        const jsonData = res.data;
        if (typeof jsonData == 'object' && jsonData.length > 0) {
          jsonData.filter((item) => {
            if (item['symbol_name'] == 'NIFTY 50') {
              temp.niftyIndex = item['last_trade_price']
            }
            if (item['symbol_name'] == 'NIFTY BANK') {
              temp.bankIndex = item['last_trade_price']
            }
            if (item['symbol_name'] == 'NIFTY FIN SERVICE') {
              temp.finIndex = item['last_trade_price']
            }
          });
          setTimeout(() => {
            setSpinner(false);
          }, 1000);
          setIndexData(temp);
        }
      })
  }

  useEffect(() => {
    const interValConfig = setInterval(getIndexData, constants.INTERVAL_TIME);
    return () => {
      clearInterval(interValConfig);
    };
  })

  return (

    <div>
      <header className="header">
        <h3>Jay Devi Mata</h3>
        <h4 className="counter">{intervalIndex}</h4>
        <span className="top counter-wrapper">
          <span className="bulls"> {niftyVwapCounter.bulls + bankVwapCounter.bulls + finVwapCounter.bulls}</span>
          <span className="bears"> {niftyVwapCounter.bears + bankVwapCounter.bears + finVwapCounter.bears}</span>
        </span>
        {spinner && <span className="loader"></span>}
      </header>

      <div className="accordion top" id="accordionPanelsStayOpenExample">
        <div className="accordion-item">
          <h2 className="accordion-header" id="panelsStayOpen-headingOne">
            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
              NIFTY <span className="orange">{Math.floor(indexData.niftyIndex)}</span>
            </button>
            <span className="counter-wrapper">
              <span className="bulls"> {niftyVwapCounter.bulls}</span>
              <span className="bears"> {niftyVwapCounter.bears}</span>
            </span>
            <span className="counter-wrapper right">
              <span className="bulls"> {niftyVwapCounterM.bulls}</span>
              <span className="bears"> {niftyVwapCounterM.bears}</span>
            </span>
          </h2>
          <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingOne">
            <div className="accordion-body">
              <NiftyComponent handleNifty={handleNifty} handleNiftyM={handleNiftyM} liveNiftyIndex={indexData.niftyIndex} />
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header" id="panelsStayOpen-headingTwo">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="false" aria-controls="panelsStayOpen-collapseTwo">
              BANK NIFTY <span className="orange">{Math.floor(indexData.bankIndex)}</span>
            </button>
            <span className="counter-wrapper">
              <span className="bulls">  {bankVwapCounter.bulls}</span>
              <span className="bears"> {bankVwapCounter.bears}</span>
            </span>
            <span className="counter-wrapper right">
              <span className="bulls">  {bankVwapCounterM.bulls}</span>
              <span className="bears"> {bankVwapCounterM.bears}</span>
            </span>
          </h2>
          <div id="panelsStayOpen-collapseTwo" className="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
            <div className="accordion-body">
              <BankComponent handleBank={handleBank} handleBankM={handleBankM} liveBankIndex={indexData.bankIndex} />
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header" id="panelsStayOpen-headingThree">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseThree" aria-expanded="false" aria-controls="panelsStayOpen-collapseThree">
              FIN NIFTY <span className="orange">{Math.floor(indexData.finIndex)}</span>
            </button>
            <span className="counter-wrapper">
              <span className="bulls"> {finVwapCounter.bulls}</span>
              <span className="bears"> {finVwapCounter.bears}</span>
            </span>
            <span className="counter-wrapper right">
              <span className="bulls"> {finVwapCounterM.bulls}</span>
              <span className="bears"> {finVwapCounterM.bears}</span>
            </span>
          </h2>
          <div id="panelsStayOpen-collapseThree" className="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingThree">
            <div className="accordion-body">
              <FinComponent handleFin={handleFin} handleFinM={handleFinM} liveFinIndex={indexData.finIndex} />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
