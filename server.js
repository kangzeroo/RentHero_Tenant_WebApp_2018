const express = require('express')
const path = require('path')
const http = require('http')
const https = require('https')
const fs = require('fs')

const app = express()

// serve static assets normally
app.use(
  express.static(path.resolve(__dirname, '/dist'))
)

// viewed at https://localhost:8080
app.get('/bundle.js', (req, res) => {
  res.sendFile(path.resolve(__dirname, './dist/bundle.js'))
})
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './dist/index.html'))
})

// Server setup
if (process.env.NODE_ENV === 'production') {
  const options = {
      ca: fs.readFileSync('./creds/example_SSL_cert.ca-bundle'),
      key: fs.readFileSync('./creds/example_SSL_cert.key'),
      cert: fs.readFileSync('./creds/example_SSL_cert.crt'),
      requestCert: false,
      rejectUnauthorized: false
  }
  // create a server with the native node https library
  const server = https.createServer(options, app)
  const port = process.env.PORT || 8888
  // listen to the server on port
  server.listen(port, () => {
    console.log('Server listening on https: ', port)
  })
} else {
  // const options = {
  //     key: fs.readFileSync('./creds/example_SSL_cert.key'),
  //     cert: fs.readFileSync('./creds/example_SSL_cert.crt'),
  //     requestCert: false,
  //     rejectUnauthorized: false
  // }
  // // create a server with the native node https library
  // const server = https.createServer(options, app)
  // const port = process.env.PORT || 4001
  // // listen to the server on port
  // server.listen(port, () => {
  //   console.log('Server listening on https: ', port)
  // })
  const port = process.env.PORT || 8888
  const server = http.createServer(app)
  server.listen(port, () => {
    console.log('Server listening on http: ', port)
  })
}
