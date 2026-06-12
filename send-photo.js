{\rtf1\ansi\ansicpg1252\cocoartf2870
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 const https = require('https');\
const querystring = require('querystring');\
\
exports.handler = async (event) => \{\
  if (event.httpMethod !== 'POST') \{\
    return \{ statusCode: 405, body: 'Method Not Allowed' \};\
  \}\
\
  const body = JSON.parse(event.body);\
\
  const params = querystring.stringify(\{\
    fileData: body.fileData,\
    fileName: body.fileName,\
    name: body.name,\
    message: body.message\
  \});\
\
  const scriptURL = 'https://script.google.com/macros/s/AKfycbyasmwiJQCpZdoHh_mdLCksNnAmRg-TND9RgLYAxGoPELFqn_2nto1FBS50xh0YjjMY/exec';\
\
  return new Promise((resolve) => \{\
    const url = new URL(scriptURL);\
    const options = \{\
      hostname: url.hostname,\
      path: url.pathname,\
      method: 'POST',\
      headers: \{\
        'Content-Type': 'application/x-www-form-urlencoded',\
        'Content-Length': Buffer.byteLength(params)\
      \}\
    \};\
\
    const req = https.request(options, (res) => \{\
      let data = '';\
      res.on('data', chunk => data += chunk);\
      res.on('end', () => \{\
        resolve(\{\
          statusCode: 200,\
          headers: \{ 'Access-Control-Allow-Origin': '*' \},\
          body: JSON.stringify(\{ status: 'ok' \})\
        \});\
      \});\
    \});\
\
    req.on('error', (err) => \{\
      resolve(\{\
        statusCode: 500,\
        body: JSON.stringify(\{ status: 'error', message: err.message \})\
      \});\
    \});\
\
    req.write(params);\
    req.end();\
  \});\
\};}