/* eslint no-console:0 */
const fs = require('fs');
const yaml = require('js-yaml');

const config = require('./config');
const { DESTINATION_RULES_KIND_PLURAL, VIRTUAL_SERVICES_KIND_PLURAL, ISTIO_API_VERSION, ISTIO_NETWORKING_API_GROUP } = require('./consts');

const k8s = require('./k8s-helper');
const bf = require('./break-and-fix-helper');

const { applyDefaultConfig } = require('./default-raw');

const virtualService = yaml.safeLoad(fs.readFileSync('./istio/catalog-virtual-service.yaml', 'utf8'));
const destinationRule = yaml.safeLoad(fs.readFileSync('./istio/catalog-destination-rule.yaml', 'utf8'));

async function main () {
  try {
    const _config = config.getInCluster();

    const result = await applyDefaultConfig(false, _config);

    if (result.success) {
      const destinationRuleCreated = await k8s.createObject(_config, ISTIO_NETWORKING_API_GROUP, ISTIO_API_VERSION, DESTINATION_RULES_KIND_PLURAL, destinationRule);
      console.log('circuit-breaker-1 simple destination rule planted: ', destinationRuleCreated);

      const virtualServiceCreated = await k8s.createObject(_config, ISTIO_NETWORKING_API_GROUP, ISTIO_API_VERSION, VIRTUAL_SERVICES_KIND_PLURAL, virtualService);
      console.log('circuit-breaker-1 simple virtual service planted: ', virtualServiceCreated);

      const breakResult = await bf.breakService('catalog', 'sleep', '5000');
      console.log('circuit-breaker-1 break planted: ', breakResult);
    } else {
      console.error('Error: ', result.error)
      return {success: false, error: 'circuit-breaker-1 break couldn\'t be applied. ' + result.error};  
    }
    
    return {success: true};
  } catch (err) {
    console.error('Error: ', err)
    return {success: false, error: err};
  }
}

module.exports.applyCircuitBreakerOneBreak = main;