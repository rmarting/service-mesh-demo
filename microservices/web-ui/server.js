const express = require('express');
const corser = require("corser");

const keycloakConfig = require('./config/keycloak.config');
const coolstoreConfig = require('./config/coolstore.config');

const { applyDefaultConfig } = require('./istio/default-raw');
const { applyHeaderRouting } = require('./istio/header-routing-raw');

const app = express();
app.use(corser.create());

app.use(express.static(__dirname + '/dist/coolstore'));

app.options("*", function (req, res) {
  // CORS
  res.writeHead(204);
  res.end();
});

// Used for App health checking
app.get('/sys/info/ping', function(req, res, next) {
  res.end('"OK"');
});

// keycloak config server
app.get('/keycloak.json', function(req, res, next) {
  res.json(keycloakConfig);
});
// coolstore config server
app.get('/coolstore.json', function(req, res, next) {
  res.json(coolstoreConfig);
});

// Used for App health checking
app.get('/istio/header-routing', async function(req, res) {
    try {
        const result = await applyHeaderRouting();
        res.send(result);
    } catch (error) {
        console.log('header-routing error', error);
        res.status(500).send({success: false, error: error});
    }
});

// Used for App health checking
app.get('/istio/default', async function(req, res) {
  try {
      const result = await applyDefaultConfig();
      res.send(result);
  } catch (error) {
      console.log('header-routing error', error);
      res.status(500).send({success: false, error: error});
  }
});

const port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;
const host = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
const server = app.listen(port, host, function() {
  console.log("App started at: " + new Date() + " on port: " + port);
});
module.exports = server;