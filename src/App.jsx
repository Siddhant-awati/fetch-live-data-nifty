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
  const [intervalIndex, setIntervalIndex] = useState(1);
  const [indexData, setIndexData] = useState({
    niftyIndex: 0,
    bankIndex: 0,
    finIndex: 0
  });

  const handleNifty = (data) => setNiftyVwapCounter(data);
  const handleBank = (data) => setBankVwapCounter(data);
  const handleFin = (data) => setFinVwapCounter(data);

  const getIndexData = () => {
    const filePath = './src/DATA/index' + intervalIndex + '.txt';
    const temp = {}
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
          setIntervalIndex(intervalIndex + 1);

          setIndexData(temp);
        }
      })
  }

  useEffect(() => {
    getIndexData();
  }, []);

  useEffect(() => {
    const interValConfig = setInterval(getIndexData, constants.INTERVAL_TIME);
    return () => {
      clearInterval(interValConfig);
    };
  })

  return (

    <div>
      <h3>Jay Devi Mata</h3>
      <h4 className="counter">{intervalIndex}</h4>
      <span className="top counter-wrapper">
        <span className="bulls">BULLISH : {niftyVwapCounter.bulls + bankVwapCounter.bulls + finVwapCounter.bulls}</span>
        <span className="bears">BEARISH : {niftyVwapCounter.bears + bankVwapCounter.bears + finVwapCounter.bears}</span>
      </span>
      <div className="accordion" id="accordionPanelsStayOpenExample">
        <div className="accordion-item">
          <h2 className="accordion-header" id="panelsStayOpen-headingOne">
            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
              NIFTY :: {indexData.niftyIndex}
            </button>
            <span className="counter-wrapper">
              <span className="bulls">BULLISH : {niftyVwapCounter.bulls}</span>
              <span className="bears">BEARISH : {niftyVwapCounter.bears}</span>
            </span>
          </h2>
          <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingOne">
            <div className="accordion-body">
              <NiftyComponent handleNifty={handleNifty} liveNiftyIndex={indexData.niftyIndex}/>
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header" id="panelsStayOpen-headingTwo">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="false" aria-controls="panelsStayOpen-collapseTwo">
              BANK_NIFTY :: {indexData.bankIndex}
            </button>
            <span className="counter-wrapper">
              <span className="bulls"> BULLISH : {bankVwapCounter.bulls}</span>
              <span className="bears">BEARISH : {bankVwapCounter.bears}</span>
            </span>
          </h2>
          <div id="panelsStayOpen-collapseTwo" className="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
            <div className="accordion-body">
              <BankComponent handleBank={handleBank} liveBankIndex={indexData.bankIndex}/>
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header" id="panelsStayOpen-headingThree">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseThree" aria-expanded="false" aria-controls="panelsStayOpen-collapseThree">
              FIN_NIFTY :: {indexData.finIndex}
            </button>
            <span className="counter-wrapper">
              <span className="bulls">BULLISH : {finVwapCounter.bulls}</span>
              <span className="bears">BEARISH : {finVwapCounter.bears}</span>
            </span>
          </h2>
          <div id="panelsStayOpen-collapseThree" className="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingThree">
            <div className="accordion-body">
              <FinComponent handleFin={handleFin} liveFinIndex={indexData.finIndex}/>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
