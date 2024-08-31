
import { response } from "./response";
import { bankNiftyResponse } from "./bankNiftyResponse";
import './App.css'
import { useEffect, useState } from "react";
import axios from 'axios';

// const dataSet = response.resultData.opDatas;
const dataSet = bankNiftyResponse.resultData.opDatas;

export default function App() {
  const [currentNiftyStrikePrice, setcurrentNiftyStrikePrice] = useState(51300);
  const [niftyDataState, setNiftyDataState] = useState([]);
  const [niftyLiveData, setNiftyLiveData] = useState(dataSet);
  
  const getLiveData = () => {
    axios.get(`./src/DATA/hello.txt`)
      .then(res => {
        const jsonData = res.data;
        console.log(jsonData);
        setNiftyLiveData(jsonData)
      })
  }
  const refreshThePage = () => {
    const lowerLimit = 1 * currentNiftyStrikePrice - 1000;
    const upperLimit = 1 * currentNiftyStrikePrice + 1000;
    const niftyTableData = [];

    niftyLiveData.filter((d, index) => {
      const currentStrike = d['strike_price'];
      const callPrice = d['calls_ltp'];
      const callVwap = d['calls_average_price'];
      const callDirection = d['calls_builtup'];
      const putDirection = d['puts_builtup'];
      const putPrice = d['puts_ltp'];
      const putVwap = d['puts_average_price'];

      if (currentStrike > lowerLimit && currentStrike < upperLimit) {
        const callBuildup = callPrice > callVwap ? 'BULLISH' : 'BEARISH';
        const putBuildup = putPrice > putVwap ? 'BEARISH' : 'BULLISH';
        const singleRow = {
          STRIKE: currentStrike,
          CALL_LTP: callPrice,
          CALL_VWAP: callVwap,
          CALL_DIR: callDirection,
          CALL_BUILD: callBuildup,
          PUT_LTP: putPrice,
          PUT_VWAP: putVwap,
          PUT_DIR: putDirection,
          PUT_BUILD: putBuildup
        }
        niftyTableData.push(singleRow);
      }
    });
    setNiftyDataState(niftyTableData);
  }

  useEffect(()=> {
    const interValConfig = setInterval(getLiveData, 5000);
    const refreshInterval = setInterval(refreshThePage, 2000);
    
    return () => {
      clearInterval(interValConfig);
      clearInterval(refreshInterval);
    };
  },[])

  return (
    <div>
      <h3>Jay Devi Mata</h3>
      <h3>{niftyLiveData.length}</h3>
      <p><label htmlFor="nifty">
        NIFTY Current Strike Price:
        <input type="number" name="nifty" id="nifty" onChange={(e) => setcurrentNiftyStrikePrice(e.target.value)} /></label><button onClick={refreshThePage} className="btn btn-primary">REFRESH</button></p>
      <table className="table table-bordered table-sm">
        <thead>
          <tr>
            <th scope="col">STRIKE PRICE</th>
            <th scope="col">Call LTP</th>
            <th scope="col">Call VWAP</th>
            <th scope="col">Call VWAP TREND</th>
            <th scope="col">Call DIRECTION</th>
            <th scope="col">Put DIRECTION</th>
            <th scope="col">Put VWAP TREND</th>
            <th scope="col">Put VWAP</th>
            <th scope="col">Put LTP</th>
          </tr>
        </thead>
        <tbody>
          {niftyDataState.map((item, index) => {
            const callLabels = ['Call Buying', 'Call Short Covering', 'Put Writing',];
            const putLabels = ['Put Buying', 'Put Short Covering', 'Call Writing',];
            const cellColorPut = item.PUT_BUILD == 'BULLISH' ? 'table-success' : 'table-danger';
            const cellColorCall = item.CALL_BUILD == 'BULLISH' ? 'table-success' : 'table-danger';
            const callBuildup = callLabels.includes(item.CALL_DIR) ? 'table-success' : 'table-danger';
            const putBuildup = putLabels.includes(item.PUT_DIR) ? 'table-danger' : 'table-success';
            const active = item.STRIKE == currentNiftyStrikePrice ? 'active' : '';

            const boldVwapPut = item.PUT_BUILD == 'BULLISH' ? 'bold' : '';
            const boldVwapCall = item.CALL_BUILD == 'BEARISH' ? 'bold' : '';

            return (
              <tr className={active} key={index}>
                <td>
                  {item.STRIKE}
                </td>
                <td>
                  {item.CALL_LTP}
                </td>
                <td className={boldVwapCall}>
                  {item.CALL_VWAP}
                </td>
                <td className={cellColorCall}>
                  {item.CALL_BUILD}
                </td>
                <td className={callBuildup}>
                  {item.CALL_DIR}
                </td>
                <td className={putBuildup}>
                  {item.PUT_DIR}
                </td>
                <td className={cellColorPut}>
                  {item.PUT_BUILD}
                </td>
                <td className={boldVwapPut}>
                  {item.PUT_VWAP}
                </td>
                <td>
                  {item.PUT_LTP}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );
}
