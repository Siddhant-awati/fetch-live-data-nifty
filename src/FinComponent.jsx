
import './App.css'
import { useEffect, useState } from "react";
import { constants } from './constants';
import { format } from 'indian-number-format';

const dataSet = [];
let currentNiftyStrikePrice = 0;
let total_calls_oi = 0;
let total_calls_change_oi = 0;
let total_puts_oi = 0;
let total_puts_change_oi = 0
let itm_calls_oi = 0;
let itm_calls_change_oi = 0;
let itm_puts_oi = 0;
let itm_puts_change_oi = 0
let otm_calls_oi = 0;
let otm_calls_change_oi = 0;
let otm_puts_oi = 0;
let otm_puts_change_oi = 0;
let call_highest_oi = 0;
let put_highest_oi = 0;

export default function FinComponent({ handleFin, handleFinM, liveFinIndex }) {
  const [intervalIndex, setIntervalIndex] = useState(0);
  const [intervalIndexM, setIntervalIndexM] = useState(0);
  const [niftyLiveData, setNiftyLiveData] = useState(dataSet);
  const [pcrTotalOI, setPcrTotalOI] = useState(0);
  const [pcrChangeOI, setPcrChangeOI] = useState(0);
  const [highestCallOI, setHighestCallOI] = useState([]);
  const [highestCallChangeOI, setHighestCallChangeOI] = useState([]);
  const [highestPutOI, setHighestPutOI] = useState([]);
  const [highestPutChangeOI, setHighestPutChangeOI] = useState([]);

  const formatIndex = (num) => {
    if (num) {
      const rounded = Math.round(num);
      const nearestStrike = rounded - (rounded % 50)
      return nearestStrike
    }
    return num;
  }
  const percentageDiff = (vwap, ltp) => {
    if (ltp < 0.5) { ltp = 1 }
    const diff = (vwap / ltp) * 100;
    return Math.round(diff) + '%';
  }
  const fetchData = async () => {
    let currentNiftyStrikePrice = 0;
    const arrayCallChnageOI = [];
    const arrayCallOI = [];
    const arrayPutChnageOI = [];
    const arrayPutOI = [];
    currentNiftyStrikePrice = formatIndex(liveFinIndex);
    const niftyTableDataTemp = [];
    const lowerLimit = currentNiftyStrikePrice - 700;
    const upperLimit = currentNiftyStrikePrice + 700;
    let bears = 0;
    let bulls = 0;
    setIntervalIndexM(intervalIndex + 1);
    try {
      const response = await fetch('https://nifty-api-data.onrender.com/api/fin-weekly');
      const data = await response.json();
      const jsonData = data.resultData.opDatas;
      if (typeof jsonData == 'object' && jsonData.length > 0) {
        total_calls_oi = 0;
        total_calls_change_oi = 0;
        total_puts_oi = 0;
        total_puts_change_oi = 0;
        itm_calls_oi = 0;
        itm_calls_change_oi = 0;
        itm_puts_oi = 0;
        itm_puts_change_oi = 0
        otm_calls_oi = 0;
        otm_calls_change_oi = 0;
        otm_puts_oi = 0;
        otm_puts_change_oi = 0
        call_highest_oi = 0;
        put_highest_oi = 0;
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
              PUT_BUILD: putBuildup,
              CALLS_OI: d.calls_oi,
              CALLS_CHANGE_OI: d.calls_change_oi,
              PUTS_OI: d.puts_oi,
              PUTS_CHANGE_OI: d.puts_change_oi
            }
            niftyTableDataTemp.push(singleRow);
            if (callBuildup == 'BEARISH') { bears++ }
            if (putBuildup == 'BEARISH') { bears++ }
            if (callBuildup == 'BULLISH') { bulls++ }
            if (putBuildup == 'BULLISH') { bulls++ }

            total_calls_oi += d.calls_oi;
            total_calls_change_oi += d.calls_change_oi;
            total_puts_oi += d.puts_oi;
            total_puts_change_oi += d.puts_change_oi;
            arrayCallChnageOI.push(d.calls_change_oi);
            arrayCallOI.push(d.calls_oi);
            arrayPutChnageOI.push(d.puts_change_oi);
            arrayPutOI.push(d.puts_oi);

            if (currentStrike <= currentNiftyStrikePrice) {
              itm_calls_oi += d.calls_oi;
              itm_calls_change_oi += d.calls_change_oi;
              itm_puts_oi += d.puts_oi;
              itm_puts_change_oi += d.puts_change_oi;
            }
            else {
              otm_calls_oi += d.calls_oi;
              otm_calls_change_oi += d.calls_change_oi;
              otm_puts_oi += d.puts_oi;
              otm_puts_change_oi += d.puts_change_oi;
            }
            call_highest_oi = d.calls_oi > call_highest_oi ? d.calls_oi : call_highest_oi;
            put_highest_oi = d.puts_oi > put_highest_oi ? d.puts_oi : put_highest_oi;
          }
        });
        setNiftyLiveData(niftyTableDataTemp);
        setPcrTotalOI(total_puts_oi / total_calls_oi);
        setPcrChangeOI(total_puts_change_oi / total_calls_change_oi);
        const a1 = arrayCallChnageOI.sort((a, b) => b - a);
        const a2 = arrayCallOI.sort((a, b) => b - a);
        const a3 = arrayPutChnageOI.sort((a, b) => b - a);
        const a4 = arrayPutOI.sort((a, b) => b - a);
        setHighestCallChangeOI(a1.slice(0, 3));
        setHighestCallOI(a2.slice(0, 3));
        setHighestPutChangeOI(a3.slice(0, 3));
        setHighestPutOI(a4.slice(0, 3));

        handleFin({
          bears: bears,
          bulls: bulls
        })
      }
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  };

  const fetchDataM = async () => {
    currentNiftyStrikePrice = formatIndex(liveFinIndex);
    const niftyTableDataTemp = [];
    const lowerLimit = currentNiftyStrikePrice - 700;
    const upperLimit = currentNiftyStrikePrice + 700;
    let bears = 0;
    let bulls = 0;
    setIntervalIndex(intervalIndexM + 1);

    try {
      const response = await fetch('https://nifty-api-data.onrender.com/api/fin-monthly');
      const data = await response.json();
      const jsonData = data.resultData.opDatas;
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
              PUT_BUILD: putBuildup,
              CALLS_OI: d.calls_oi,
              CALLS_CHANGE_OI: d.calls_change_oi,
              PUTS_OI: d.puts_oi,
              PUTS_CHANGE_OI: d.puts_change_oi
            }
            niftyTableDataTemp.push(singleRow);
            if (callBuildup == 'BEARISH') { bears++ }
            if (putBuildup == 'BEARISH') { bears++ }
            if (callBuildup == 'BULLISH') { bulls++ }
            if (putBuildup == 'BULLISH') { bulls++ }
          }
        });
        handleFinM({
          bears: bears,
          bulls: bulls
        })
      }

    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  };

  useEffect(() => {
    const interValConfig = setInterval(fetchData, constants.INTERVAL_TIME);
    const interValConfigM = setInterval(fetchDataM, constants.INTERVAL_TIME);
    return () => {
      clearInterval(interValConfig);
      clearInterval(interValConfigM);
    };
  })
  useEffect(() => {
    setTimeout(() => {
      fetchData();
      fetchDataM();
    }, 1000)
  }, []);

  return (
    <div className='main-container'>
      <ul className="nav nav-pills mb-3" id="pills-tab1" role="tablist">
        <li className="nav-item" role="presentation">
          <button className="nav-link active" id="home-tab1" data-bs-toggle="tab" data-bs-target="#home-tab1-pane" type="button" role="tab" aria-controls="home-tab1-pane" aria-selected="true">VWAP</button>
        </li>
        <li className="nav-item" role="presentation">
          <button className="nav-link" id="profile-tab1" data-bs-toggle="tab" data-bs-target="#profile-tab1-pane" type="button" role="tab" aria-controls="profile-tab1-pane" aria-selected="false">OI</button>
        </li>
      </ul>
      <p className='pcr-data'>
        <span className={(Math.round(pcrTotalOI * 100) / 100).toFixed(2) >= 1 ? 'green' : 'red'}>PCR Total:
          <span className='circle'> {(Math.round(pcrTotalOI * 100) / 100).toFixed(2)} </span>
        </span>
        <span className={(Math.round(pcrChangeOI * 100) / 100).toFixed(2) >= 1 ? 'green' : 'red'}>PCR Change:
          <span className='circle'> {(Math.round(pcrChangeOI * 100) / 100).toFixed(2)}</span>
        </span>
      </p>
      <div className="tab-content" id="myTabContent1">
        <div className="tab-pane fade show active" id="home-tab1-pane" role="tabpanel" aria-labelledby="home-tab1" tabIndex="0">
          {niftyLiveData.length > 0 &&
            <table className="table table-bordered table-sm">
              <thead>
                <tr>
                  <th scope="col">Call LTP</th>
                  <th scope="col">Call VWAP</th>
                  <th scope="col">Call VWAP TREND</th>
                  <th scope="col">STRIKE PRICE</th>
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
                        {item.CALL_LTP}
                      </td>
                      <td className={boldVwapCall}>
                        {item.CALL_VWAP} ({percentageDiff(item.CALL_VWAP, item.CALL_LTP)})
                      </td>
                      <td className={cellColorCall}>
                        {item.CALL_BUILD}
                      </td>
                      <td className='strike-price'>
                        {item.STRIKE}
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
        <div className="tab-pane fade" id="profile-tab1-pane" role="tabpanel" aria-labelledby="profile-tab1" tabIndex="0">
          {niftyLiveData.length > 0 &&
            <table className="table table-bordered table-sm">
              <thead>
                <tr>
                  <th scope="col">Call DIRECTION</th>
                  <th scope="col">Call Change OI</th>
                  <th scope="col">Call OI</th>
                  <th scope="col">STRIKE PRICE</th>
                  <th scope="col">Put OI</th>
                  <th scope="col">Put Change OI</th>
                  <th scope="col">Put DIRECTION</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td></td>
                  <td>{format(total_calls_change_oi)}</td>
                  <td>{format(total_calls_oi)}</td>
                  <td className='bold'>TOTAL OPEN INTEREST</td>
                  <td>{format(total_puts_oi)}</td>
                  <td>{format(total_puts_change_oi)}</td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td>{format(itm_calls_change_oi)}</td>
                  <td>{format(itm_calls_oi)}</td>
                  <td className='bold'>IN THE MONEY</td>
                  <td>{format(itm_puts_oi)}</td>
                  <td>{format(itm_puts_change_oi)}</td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td>{format(otm_calls_change_oi)}</td>
                  <td>{format(otm_calls_oi)}</td>
                  <td className='bold'>OUT THE MONEY</td>
                  <td>{format(otm_puts_oi)}</td>
                  <td>{format(otm_puts_change_oi)}</td>
                  <td></td>
                </tr>
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
                      <td className={callBuildup}>
                        {item.CALL_DIR}
                      </td>
                      <td className={item.CALLS_CHANGE_OI < 0 ? 'table-success' : ''}>
                        <span className={highestCallChangeOI.includes(item.CALLS_CHANGE_OI) ? 'highest-change-call blink' : ''}>
                          {format(item.CALLS_CHANGE_OI)}
                        </span>
                      </td>
                      <td className={highestCallOI.includes(item.CALLS_OI) ? 'highest-put' : ''}>
                        {format(item.CALLS_OI)}
                      </td>
                      <td className='strike-price'>
                        {item.STRIKE}
                      </td>
                      <td className={highestPutOI.includes(item.PUTS_OI) ? 'highest-call' : ''}>
                        {format(item.PUTS_OI)}
                      </td>
                      <td className={item.PUTS_CHANGE_OI < 0 ? 'table-danger' : ''}>
                        <span className={highestPutChangeOI.includes(item.PUTS_CHANGE_OI) ? 'highest-change-put blink' : ''}>{format(item.PUTS_CHANGE_OI)}</span>
                      </td>
                      <td className={putBuildup}>
                        {item.PUT_DIR}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>}
        </div>
      </div>
    </div>
  );
}
