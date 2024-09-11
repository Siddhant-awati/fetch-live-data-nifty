
const niftyMonthly = "https://webapi.niftytrader.in/webapi/option/fatch-option-chain?symbol=nifty&expiryDate=2024-09-26"
const bankMonthly = "https://webapi.niftytrader.in/webapi/option/fatch-option-chain?symbol=banknifty&expiryDate=2024-09-25"
const finMonthly = "https://webapi.niftytrader.in/webapi/option/fatch-option-chain?symbol=finnifty&expiryDate=2024-09-24"
const niftyAPI = "https://webapi.niftytrader.in/webapi/option/fatch-option-chain?symbol=nifty&expiryDate=";
const finAPI = "https://webapi.niftytrader.in/webapi/option/fatch-option-chain?symbol=finnifty&expiryDate=";
const bankAPI = "https://webapi.niftytrader.in/webapi/option/fatch-option-chain?symbol=banknifty&expiryDate=";
const indexAPI = "https://webapi.niftytrader.in/webapi/symbol/stock-index-data";

export const constants = {
    INTERVAL_TIME: 10000,
    PROXY_URL: 'https://api.allorigins.win/raw?url=',
    NIFTY_W: niftyAPI,
    BANK_W: bankAPI,
    FIN_W: finAPI,
    NIFTY_M: niftyMonthly,
    BANK_M: bankMonthly,
    FIN_M: finMonthly,
    INDEX: indexAPI
}
