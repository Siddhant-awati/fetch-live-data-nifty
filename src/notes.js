// const niftyAPI = "https://webapi.niftytrader.in/webapi/option/fatch-option-chain?symbol=nifty&expiryDate=", finAPI = "https://webapi.niftytrader.in/webapi/option/fatch-option-chain?symbol=finnifty&expiryDate=", bankAPI = "https://webapi.niftytrader.in/webapi/option/fatch-option-chain?symbol=banknifty&expiryDate=", indexAPI = "https://webapi.niftytrader.in/webapi/symbol/stock-index-data"; var counterN = 0, counterB = 0, counterF = 0, counterI = 0; async function getIndexData() { var t; try { let a = await fetch("https://webapi.niftytrader.in/webapi/symbol/stock-index-data"); if (!a.ok) throw Error(`Response status: ${a.status}`); return t = await a.json() } catch (e) { console.error(e.message) } } async function getNiftyData() { var t; try { let a = await fetch("https://webapi.niftytrader.in/webapi/option/fatch-option-chain?symbol=nifty&expiryDate="); if (!a.ok) throw Error(`Response status: ${a.status}`); return t = await a.json() } catch (e) { console.error(e.message) } } async function getBankData() { var t; try { let a = await fetch("https://webapi.niftytrader.in/webapi/option/fatch-option-chain?symbol=banknifty&expiryDate="); if (!a.ok) throw Error(`Response status: ${a.status}`); return t = await a.json() } catch (e) { console.error(e.message) } } async function getFinData() { var t; try { let a = await fetch("https://webapi.niftytrader.in/webapi/option/fatch-option-chain?symbol=finnifty&expiryDate="); if (!a.ok) throw Error(`Response status: ${a.status}`); return t = await a.json() } catch (e) { console.error(e.message) } } function download(t, a) { var e = document.createElement("a"); e.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(a)), e.setAttribute("download", t), e.style.display = "none", document.body.appendChild(e), e.click(), document.body.removeChild(e) } function triggerDataFetchNifty() { counterN++; let t = "nifty" + counterN + ".txt", a = getNiftyData(); a.then(a => { console.log("setTimeout stringData => ", a.resultData.opDatas), download(t, JSON.stringify(a.resultData.opDatas)) }) } function triggerDataFetchBank() { counterB++; let t = "bank" + counterB + ".txt", a = getBankData(); a.then(a => { console.log("setTimeout stringData => ", a.resultData.opDatas), download(t, JSON.stringify(a.resultData.opDatas)) }) } function triggerDataFetchFin() { counterF++; let t = "fin" + counterF + ".txt", a = getFinData(); a.then(a => { console.log("setTimeout stringData => ", a.resultData.opDatas), download(t, JSON.stringify(a.resultData.opDatas)) }) } function triggerDataFetchIndex() { counterI++; let t = "index" + counterI + ".txt", a = getIndexData(); a.then(a => { console.log("setTimeout stringData => ", a.resultData), download(t, JSON.stringify(a.resultData)) }) } setInterval(triggerDataFetchNifty, 15e3), setInterval(triggerDataFetchFin, 15e3), setInterval(triggerDataFetchBank, 15e3), setInterval(triggerDataFetchIndex, 15e3);





//FINAL WORKING CODE
const niftyMonthly = "https://webapi.niftytrader.in/webapi/option/fatch-option-chain?symbol=nifty&expiryDate=2024-09-26"
const bankMonthly = "https://webapi.niftytrader.in/webapi/option/fatch-option-chain?symbol=banknifty&expiryDate=2024-09-25"
const finMonthly = "https://webapi.niftytrader.in/webapi/option/fatch-option-chain?symbol=finnifty&expiryDate=2024-09-24"

const niftyAPI = "https://webapi.niftytrader.in/webapi/option/fatch-option-chain?symbol=nifty&expiryDate=";
const finAPI = "https://webapi.niftytrader.in/webapi/option/fatch-option-chain?symbol=finnifty&expiryDate=";
const bankAPI = "https://webapi.niftytrader.in/webapi/option/fatch-option-chain?symbol=banknifty&expiryDate=";
const indexAPI = "https://webapi.niftytrader.in/webapi/symbol/stock-index-data";
var counterN = 0;
var counterB = 0;
var counterF = 0;
var counterI = 0;
const intervalTime = 15000;
async function getIndexData() {
  var jsonData;
  const url = indexAPI;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    jsonData = await response.json();
    return jsonData
  } catch (error) {
    console.error(error.message);
  }
}

async function getNiftyData() {
  var jsonData;
  const url = niftyAPI;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    jsonData = await response.json();
    return jsonData
  } catch (error) {
    console.error(error.message);
  }
}
async function getNiftyMonthlyData() {
  var jsonData;
  const url = niftyMonthly;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    jsonData = await response.json();
    return jsonData
  } catch (error) {
    console.error(error.message);
  }
}

async function getBankData() {
  var jsonData;
  const url = bankAPI;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    jsonData = await response.json();
    return jsonData
  } catch (error) {
    console.error(error.message);
  }
}
async function getBankMonthlyData() {
  var jsonData;
  const url = bankMonthly;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    jsonData = await response.json();
    return jsonData
  } catch (error) {
    console.error(error.message);
  }
}
async function getFinData() {
  var jsonData;
  const url = finAPI;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    jsonData = await response.json();
    return jsonData

  } catch (error) {
    console.error(error.message);
  }
}
async function getFinMonthlyData() {
  var jsonData;
  const url = finMonthly;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    jsonData = await response.json();
    return jsonData

  } catch (error) {
    console.error(error.message);
  }
}

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

function triggerDataFetchNifty() {
  const fileName = 'nifty' + counterN + '.txt';
  const fileNameM = 'niftyM' + counterN + '.txt';
  const stringData = getNiftyData();
  const stringDataM = getNiftyMonthlyData();
  stringData.then((data) => {
    download(fileName, JSON.stringify(data.resultData.opDatas));
  });
  stringDataM.then((data) => {
    download(fileNameM, JSON.stringify(data.resultData.opDatas));
  });
  counterN++;
}
function triggerDataFetchBank() {
  const fileName = 'bank' + counterB + '.txt';
  const fileNameM = 'bankM' + counterB + '.txt';
  const stringData = getBankData();
  const stringDataM = getBankMonthlyData();
  stringData.then((data) => {
    download(fileName, JSON.stringify(data.resultData.opDatas));
  });
  stringDataM.then((data) => {
    download(fileNameM, JSON.stringify(data.resultData.opDatas));
  });
  counterB++;
}
function triggerDataFetchFin() {
  const fileName = 'fin' + counterF + '.txt';
  const fileNameM = 'finM' + counterF + '.txt';
  const stringData = getFinData();
  const stringDataM = getFinMonthlyData();
  stringData.then((data) => {
    download(fileName, JSON.stringify(data.resultData.opDatas));
  });
  stringDataM.then((data) => {
    download(fileNameM, JSON.stringify(data.resultData.opDatas));
  });
  counterF++;

}
function triggerDataFetchIndex() {
  const fileName = 'index' + counterI + '.txt';
  const stringData = getIndexData();
  stringData.then((data) => {
    console.log('setTimeout stringData => ', data.resultData);
    download(fileName, JSON.stringify(data.resultData));
  });
  counterI++;
}
setInterval(triggerDataFetchNifty, intervalTime);
setInterval(triggerDataFetchFin, intervalTime);
setInterval(triggerDataFetchBank, intervalTime);
setInterval(triggerDataFetchIndex, intervalTime);





