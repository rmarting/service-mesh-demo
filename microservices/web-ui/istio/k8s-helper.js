/* eslint no-console:0 */
const rp = require('request-promise-native');

async function deleteObject (config, apiGroup, apiVersion, kindPlural, objectName) {
  const baseUri = `apis/${apiGroup}/${apiVersion}/namespaces/${config.namespace}/${kindPlural}`;
  var options = {
    agentOptions: {
      ca: config.ca
    },
    rejectUnauthorized: false,
    method: 'DELETE',
    uri: config.url + '/' + baseUri + '/' + objectName,
    headers: {
      'Authorization': 'Bearer ' + config.auth.bearer
    },
    json: true // Automatically parses the JSON string in the response
  };

  return await rp(options);
}

async function createObject (config, apiGroup, apiVersion, kindPlural, object) {
  const baseUri = `apis/${apiGroup}/${apiVersion}/namespaces/${config.namespace}/${kindPlural}`;
  var options = {
    agentOptions: {
      ca: config.ca
    },
    rejectUnauthorized: false,
    method: 'POST',
    body: object,
    uri: config.url + '/' + baseUri,
    headers: {
        'Authorization': 'Bearer ' + config.auth.bearer
    },
    json: true // Automatically parses the JSON string in the response
  };

  return await rp(options);
}

async function scaleDeploymentConfig (config, objectName, replicas) {
  const baseUri = `apis/apps.openshift.io/v1/namespaces/${config.namespace}/deploymentconfigs`;
  var options = {
    agentOptions: {
      ca: config.ca
    },
    rejectUnauthorized: false,
    method: 'PATCH',
    body: {spec:{replicas: replicas }},
    uri: config.url + '/' + baseUri + '/' + objectName,
    headers: {
      'Authorization': 'Bearer ' + config.auth.bearer,
      'Content-Type': 'application/strategic-merge-patch+json'
    },
    json: true // Automatically parses the JSON string in the response
  };

  return await rp(options);
}

module.exports.deleteObject = deleteObject;
module.exports.createObject = createObject;
module.exports.scaleDeploymentConfig = scaleDeploymentConfig;