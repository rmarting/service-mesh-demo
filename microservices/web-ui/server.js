const express = require('express');
const corser = require("corser");

const keycloakConfig = require('./config/keycloak.config');
const coolstoreConfig = require('./config/coolstore.config');

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

const port = process.env.PORT || process.env.WEB_UI_PORT || 8080;
const host = process.env.IP || process.env.WEB_UI_CUSTOM_HOST || '0.0.0.0';
const server = app.listen(port, host, function() {
  console.log("App started at: " + new Date() + " on port: " + port);
});
module.exports = server;