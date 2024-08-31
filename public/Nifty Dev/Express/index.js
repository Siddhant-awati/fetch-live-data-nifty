var express = require('express')
var cors = require('cors')
var app = express()

var corsOptions = {
  origin: 'https://webapi.niftytrader.in',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.get('https://webapi.niftytrader.in/webapi/option/fatch-option-chain?symbol=nifty', cors(corsOptions), function (req, res, next) {
  res.json({msg: 'This is CORS-enabled for only example.com.'})
})

app.listen(8000, 'localhost', function () {
  console.log('CORS-enabled web server listening on port 8000')
})