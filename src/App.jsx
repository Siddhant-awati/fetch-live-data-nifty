import { useEffect, useState } from "react";

import NiftyComponent from './NiftyComponent';
import BankComponent from './BankComponent';
import FinComponent from './FinComponent';

const tempCounter = { bears: 0, bulls: 0 }
export default function App() {
  const [niftyVwapCounter, setNiftyVwapCounter] = useState(tempCounter);
  const [bankVwapCounter, setBankVwapCounter] = useState(tempCounter);
  const [finVwapCounter, setFinVwapCounter] = useState(tempCounter);

  const handleNifty = (data) => setNiftyVwapCounter(data);
  const handleBank = (data) => setBankVwapCounter(data);
  const handleFin = (data) => setFinVwapCounter(data);

  return (

    <div>
      <h3>Jay Devi Mata</h3>
      <span className="top counter-wrapper">
        <span className="bulls">BULLISH : {niftyVwapCounter.bulls + bankVwapCounter.bulls + finVwapCounter.bulls}</span>
        <span className="bears">BEARISH : {niftyVwapCounter.bears + bankVwapCounter.bears + finVwapCounter.bears}</span>
      </span>
      <div className="accordion" id="accordionPanelsStayOpenExample">
        <div className="accordion-item">
          <h2 className="accordion-header" id="panelsStayOpen-headingOne">
            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
              NIFTY
            </button>
            <span className="counter-wrapper">
              <span className="bulls">BULLISH : {niftyVwapCounter.bulls}</span>
              <span className="bears">BEARISH : {niftyVwapCounter.bears}</span>
            </span>
          </h2>
          <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingOne">
            <div className="accordion-body">
              <NiftyComponent handleNifty={handleNifty} />
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header" id="panelsStayOpen-headingTwo">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="false" aria-controls="panelsStayOpen-collapseTwo">
              BANK_NIFTY
            </button>
            <span className="counter-wrapper">
              <span className="bulls"> BULLISH : {bankVwapCounter.bulls}</span>
              <span className="bears">BEARISH : {bankVwapCounter.bears}</span>
            </span>
          </h2>
          <div id="panelsStayOpen-collapseTwo" className="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
            <div className="accordion-body">
              <BankComponent handleBank={handleBank} />
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header" id="panelsStayOpen-headingThree">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseThree" aria-expanded="false" aria-controls="panelsStayOpen-collapseThree">
              FIN_NIFTY
            </button>
            <span className="counter-wrapper">
              <span className="bulls">BULLISH : {finVwapCounter.bulls}</span>
              <span className="bears">BEARISH : {finVwapCounter.bears}</span>
            </span>
          </h2>
          <div id="panelsStayOpen-collapseThree" className="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingThree">
            <div className="accordion-body">
              <FinComponent handleFin={handleFin} />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
