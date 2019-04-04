/* eslint no-console:0 */
const fs = require('fs');
const yaml = require('js-yaml');

const config = require('./config');

const consts = require('./consts');

const k8s = require('./k8s-helper');

// This virtual service definition adds a timeout to avoid a cascading timeout effect
const virtualService = yaml.safeLoad(fs.readFileSync('./istio/circuit-breaker-1-fix-virtual-service.yaml', 'utf8'));

async function main () {
  try {
    const _config = config.getInCluster();

    try {
      const virtualServiceDeleted = await k8s.deleteObject(_config, 
        consts.ISTIO_NETWORKING_API_GROUP, 
        consts.ISTIO_API_VERSION, 
        consts.VIRTUAL_SERVICES_KIND_PLURAL, 
        virtualService.metadata.name);
      console.log('circuit-breaker-1 virtual service deleted: ', virtualServiceDeleted);
    } catch (error) {}

    const virtualServiceCreated = await k8s.createObject(_config, 
      consts.ISTIO_NETWORKING_API_GROUP, 
      consts.ISTIO_API_VERSION, 
      consts.VIRTUAL_SERVICES_KIND_PLURAL, 
      virtualService);
    console.log('circuit-breaker-1 \'fix\' planted: ', virtualServiceCreated);

    return {success: true};
  } catch (err) {
    console.error('Error: ', err)
    return {success: false, error: err};
  }
}

module.exports.applyCircuitBreakerOneFix = main;