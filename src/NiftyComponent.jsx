import './App.css'
import { useEffect, useState } from "react";
import axios from 'axios';
import { constants } from './constants';

const dataSet = [];
let currentNiftyStrikePrice = 0;

export default function NiftyComponent({handleNifty, handleNiftyM, liveNiftyIndex}) {
  const [intervalIndex, setIntervalIndex] = useState(0);
  const [intervalIndexM, setIntervalIndexM] = useState(0);
  const [niftyLiveData, setNiftyLiveData] = useState(dataSet);
  const formatIndex = (num) => {
    if(num){
      const rounded = Math.round(num);
      const nearestStrike = rounded - (rounded % 50)
      return nearestStrike
    }
    return num;
  }
  const percentageDiff = (vwap, ltp) => {
    if(ltp < 0.5) {ltp = 1}
    const diff = (vwap / ltp) * 100;
    return Math.round(diff) + '%';
  }
  const getLiveData = () => {
    currentNiftyStrikePrice = formatIndex(liveNiftyIndex);
    const niftyTableDataTemp = [];
    const lowerLimit = currentNiftyStrikePrice - 700;
    const upperLimit = currentNiftyStrikePrice + 700;
    console.log('current Nifty Strike Price : ', currentNiftyStrikePrice);
    let bears = 0;
    let bulls = 0;
    setIntervalIndexM(intervalIndex + 1);
    const niftyUrl = constants.PROXY_URL+constants.NIFTY_W;
    axios.get(niftyUrl)
      .then(res => {
        const jsonData = res.data.resultData.opDatas;
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
              if(callBuildup == 'BEARISH') {bears++}
              if(putBuildup == 'BEARISH') {bears++}
              if(callBuildup == 'BULLISH') {bulls++}
              if(putBuildup == 'BULLISH') {bulls++}
            }
          
          });
          setNiftyLiveData(niftyTableDataTemp);
          handleNifty({
            bears:bears,
            bulls:bulls
          })
        }

      })
  }
  const getLiveDataM = () => {
    currentNiftyStrikePrice = formatIndex(liveNiftyIndex);
    const niftyTableDataTemp = [];
    const lowerLimit = currentNiftyStrikePrice - 700;
    const upperLimit = currentNiftyStrikePrice + 700;
    let bears = 0;
    let bulls = 0;
    setIntervalIndex(intervalIndexM + 1);
    axios.get(constants.PROXY_URL+constants.NIFTY_M)
      .then(res => {
        const jsonData = res.data.resultData.opDatas;
        if (typeof jsonData == 'object' && jsonData.length > 0) {

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

              if(callBuildup == 'BEARISH') {bears++}
              if(putBuildup == 'BEARISH') {bears++}
              if(callBuildup == 'BULLISH') {bulls++}
              if(putBuildup == 'BULLISH') {bulls++}
            
            }
          });
          handleNiftyM({
            bears:bears,
            bulls:bulls
          })
        }

      })
  }
  useEffect(() => {
    const interValConfig = setInterval(getLiveData, constants.INTERVAL_TIME);
    const interValConfigM = setInterval(getLiveDataM, constants.INTERVAL_TIME);
    return () => {
      clearInterval(interValConfig);
      clearInterval(interValConfigM);
    };
  })

  return (
    <div>
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
                  {item.CALL_VWAP} ({percentageDiff(item.CALL_VWAP, item.CALL_LTP)})
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
                  {item.PUT_VWAP} ({percentageDiff(item.PUT_VWAP, item.PUT_LTP)})
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
