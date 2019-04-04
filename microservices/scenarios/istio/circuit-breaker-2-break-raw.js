/* eslint no-console:0 */
const fs = require('fs');
const yaml = require('js-yaml');

const config = require('./config');
const consts = require('./consts');

const k8s = require('./k8s-helper');
const bf = require('./break-and-fix-helper');

const { applyDefaultConfig } = require('./default-raw');

const virtualService = yaml.safeLoad(fs.readFileSync('./istio/inventory-virtual-service.yaml', 'utf8'));
const destinationRule = yaml.safeLoad(fs.readFileSync('./istio/inventory-destination-rule.yaml', 'utf8'));

async function main () {
  try {
    const _config = config.getInCluster();

    const result = await applyDefaultConfig(false, _config);

    if (result.success) {
      const inventoryV1Scaled = await k8s.scaleDeploymentConfig(_config, consts.INVENTORY_DC_V1, 2);
      console.debug('inventoryV1Scaled: ', inventoryV1Scaled);

      const destinationRuleCreated = await k8s.createObject(_config, 
        consts.ISTIO_NETWORKING_API_GROUP, 
        consts.ISTIO_API_VERSION, 
        consts.DESTINATION_RULES_KIND_PLURAL, 
        destinationRule);
      console.log('circuit-breaker-2 simple destination rule planted: ', destinationRuleCreated);

      const virtualServiceCreated = await k8s.createObject(_config, 
        consts.ISTIO_NETWORKING_API_GROUP,
        consts.ISTIO_API_VERSION,
        consts.VIRTUAL_SERVICES_KIND_PLURAL,
        virtualService);
      console.log('circuit-breaker-2 simple virtual service planted: ', virtualServiceCreated);

      const breakResult = await bf.breakService('inventory', 'exception', 'circuit-breaker-2-break');
      console.log('circuit-breaker-2 break planted: ', breakResult);
    } else {
      console.error('Error: ', result.error)
      return {success: false, error: 'circuit-breaker-2 break couldn\'t be applied. ' + result.error};  
    }
    
    return {success: true};
  } catch (err) {
    console.error('Error: ', err)
    return {success: false, error: err};
  }
}

module.exports.applyCircuitBreakerTwoBreak = main;