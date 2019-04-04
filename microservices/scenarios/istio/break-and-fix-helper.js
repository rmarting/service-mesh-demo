/* eslint no-console:0 */
const rp = require('request-promise-native');

const NAMESPACE = process.env.OPENSHIFT_BUILD_NAMESPACE || 'coolstore';
const BASE_DOMAIN = process.env.BASE_DOMAIN || 'svc.cluster.local';

async function breakService (service, breakType, breakParam) {
  const baseUrl =  `http://${service}-${NAMESPACE}.${BASE_DOMAIN}`;
  var options = {
    rejectUnauthorized: false,
    method: 'GET',
    uri: baseUrl + `/api/break/${breakType}/${breakParam}`,
    json: true // Automatically parses the JSON string in the response
  };

  return await rp(options);
}

async function fixService (service, breakType) {
  const baseUrl =  `http://${service}-${NAMESPACE}.${BASE_DOMAIN}`;
  var options = {
    rejectUnauthorized: false,
    method: 'GET',
    uri: baseUrl + `/api/fix/${breakType}`,
    json: true // Automatically parses the JSON string in the response
  };

  return await rp(options);
}

module.exports.breakService = breakService;
module.exports.fixService = fixService;