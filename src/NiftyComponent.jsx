
import { response } from "./response";
import { bankNiftyResponse } from "./bankNiftyResponse";
import './App.css'
import { useEffect, useState } from "react";
import axios from 'axios';

// const dataSet = response.resultData.opDatas;
//const dataSet = bankNiftyResponse.resultData.opDatas;
const dataSet = [];

export default function NiftyComponent() {
  const [intervalIndex, setIntervalIndex] = useState(0);
  const [currentNiftyStrikePrice, setcurrentNiftyStrikePrice] = useState(25200);
  const [niftyLiveData, setNiftyLiveData] = useState(dataSet);

  const getLiveData = () => {
    const niftyTableDataTemp = [];
    const lowerLimit = currentNiftyStrikePrice - 500;
    const upperLimit = currentNiftyStrikePrice + 500;
    console.log('lowerLimit, upperLimit : ', currentNiftyStrikePrice, lowerLimit, upperLimit, intervalIndex);
    const filePath = './src/DATA/nifty'+intervalIndex+'.txt';
    axios.get(filePath)
      .then(res => {
        const jsonData = res.data;
        if (jsonData.length > 0) {

          jsonData.filter((d, index) => {
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
              niftyTableDataTemp.push(singleRow);
            }
          });
          setIntervalIndex(prev => prev + 1);
          setNiftyLiveData(niftyTableDataTemp);
        }

      })
  }
  const updateStrikePrice = (e) => {
    setcurrentNiftyStrikePrice(1 * e.target.value);
  }
  useEffect(() => { 
    getLiveData();
   }, []);
   
  useEffect(() => {
    const interValConfig = setInterval(getLiveData, 30000);
    return () => {
      clearInterval(interValConfig);
    };
  })

  return (
    <div>
      <h5>COUNTER = {niftyLiveData.length} : {intervalIndex}</h5>
      <p><label htmlFor="nifty">
        NIFTY Current Strike Price:
        <input type="number" name="nifty" id="nifty" onBlur={(e) => updateStrikePrice(e)} /></label>
        <button className="btn btn-primary">REFRESH</button></p>
      {niftyLiveData.length > 0 && <table className="table table-bordered table-sm">
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
          {niftyLiveData.map((item, index) => {
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
      </table>}
    </div>
  );
}
