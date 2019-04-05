const express = require('express');
const corser = require("corser");

const { applyDefaultConfig } = require('./istio/default-raw');
const { applyHeaderRouting } = require('./istio/header-routing-raw');

const { applyCircuitBreakerOneBreak } = require('./istio/circuit-breaker-1-break-raw');
const { applyCircuitBreakerOneFix } = require('./istio/circuit-breaker-1-fix-raw');

const { applyCircuitBreakerTwoBreak } = require('./istio/circuit-breaker-2-break-raw');
const { applyCircuitBreakerTwoFix } = require('./istio/circuit-breaker-2-fix-raw');

const app = express();
app.use(corser.create());

app.options("*", function (req, res) {
  // CORS
  res.writeHead(204);
  res.end();
});

// Used for App health checking
app.get('/sys/info/ping', function(req, res, next) {
  res.end('"OK"');
});

// Scenario: Circuit Breaker I - Break
app.get('/istio/circuit-breaker-1-break', async function(req, res) {
  try {
      const result = await applyCircuitBreakerOneBreak();
      res.send(result);
  } catch (error) {
      console.log('circuit-breaker-1 \'break\' error', error);
      res.status(500).send({success: false, error: error});
  }
});

// Scenario: Circuit Breaker I - Fix
app.get('/istio/circuit-breaker-1-fix', async function(req, res) {
  try {
      const result = await applyCircuitBreakerOneFix();
      res.send(result);
  } catch (error) {
      console.log('circuit-breaker-1 \'fix\' error', error);
      res.status(500).send({success: false, error: error});
  }
});

// Scenario: Circuit Breaker II - Break
app.get('/istio/circuit-breaker-2-break', async function(req, res) {
  try {
      const result = await applyCircuitBreakerTwoBreak();
      res.send(result);
  } catch (error) {
      console.log('circuit-breaker-2 \'break\' error', error);
      res.status(500).send({success: false, error: error});
  }
});

// Scenario: Circuit Breaker II - Fix
app.get('/istio/circuit-breaker-2-fix', async function(req, res) {
  try {
      const result = await applyCircuitBreakerTwoFix();
      res.send(result);
  } catch (error) {
      console.log('circuit-breaker-2 \'fix\' error', error);
      res.status(500).send({success: false, error: error});
  }
});

// Scenario: Header Routing
app.get('/istio/header-routing', async function(req, res) {
    try {
        const result = await applyHeaderRouting();
        res.send(result);
    } catch (error) {
        console.log('header-routing error', error);
        res.status(500).send({success: false, error: error});
    }
});

// Scenario: Default
app.get('/istio/default', async function(req, res) {
  try {
      const result = await applyDefaultConfig(true);
      res.send(result);
  } catch (error) {
      console.log('header-routing error', error);
      res.status(500).send({success: false, error: error});
  }
});

const port = process.env.PORT || process.env.SCENARIOS_CUSTOM_PORT || 8080;
const host = process.env.IP || process.env.SCENARIOS_CUSTOM_HOST || '0.0.0.0';
const server = app.listen(port, host, function() {
  console.log("App started at: " + new Date() + " on port: " + port);
});
module.exports = server;