/* eslint no-console:0 */
const rp = require('request-promise-native');
const fs = require('fs');
const yaml = require('js-yaml');

const config = require('./config');
const consts = require('./consts');

const k8s = require('./k8s-helper');

const { applyDefaultConfig } = require('./default-raw');

const virtualService = yaml.safeLoad(fs.readFileSync('./istio/header-routing-virtual-service.yaml', 'utf8'));
const destinationRule = yaml.safeLoad(fs.readFileSync('./istio/header-routing-destination-rule.yaml', 'utf8'));

async function main () {
  try {
    const _config = config.getInCluster();

    const result = await applyDefaultConfig(false, _config);

    if (result.success) {
      const inventoryV2Scaled = await k8s.scaleDeploymentConfig(_config, consts.INVENTORY_DC_V2, 1);
      console.debug('inventoryV2Scaled: ', inventoryV2Scaled);
      
      const virtualServiceCreated = await k8s.createObject(_config, 
        consts.ISTIO_NETWORKING_API_GROUP,
        consts.ISTIO_API_VERSION, 
        consts.VIRTUAL_SERVICES_KIND_PLURAL, 
        virtualService);
      console.log('header-routing simple virtual service planted: ', virtualServiceCreated);

      const destinationRuleCreated = await k8s.createObject(_config, 
        consts.ISTIO_NETWORKING_API_GROUP,
        consts.ISTIO_API_VERSION, 
        consts.DESTINATION_RULES_KIND_PLURAL, 
        destinationRule);
      console.log('header-routing simple destination rule planted: ', destinationRuleCreated);
    } else {
      console.error('Error: ', result.error)
      return {success: false, error: 'header-routing command couldn\'t be applied. ' + result.error};  
    }

    return {success: true};
  } catch (err) {
    console.error('Error: ', err)
    return {success: false, error: err};
  }
}

module.exports.applyHeaderRouting = main;