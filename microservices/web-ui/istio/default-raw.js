/* eslint no-console:0 */
const rp = require('request-promise-native');
const fs = require('fs');
const yaml = require('js-yaml');

const config = require('./config');

const k8s = require('./k8s-helper');

const API_GROUP = "networking.istio.io";
const API_VERSION = "v1alpha3";

const INVENTORY_DC_V2 = 'inventory-v2';

const inventoryVirtualService = yaml.safeLoad(fs.readFileSync('./istio/inventory-virtual-service.yaml', 'utf8'));
const catalogVirtualService = yaml.safeLoad(fs.readFileSync('./istio/catalog-virtual-service.yaml', 'utf8'));
const inventoryDestinationRule = yaml.safeLoad(fs.readFileSync('./istio/inventory-destination-rule.yaml', 'utf8'));
const catalogDestinationRule = yaml.safeLoad(fs.readFileSync('./istio/catalog-destination-rule.yaml', 'utf8'));

const VIRTUAL_SERVICES_KIND_PLURAL = 'virtualservices';
const DESTINATION_RULES_KIND_PLURAL = 'destinationrules';

async function main () {
  try {
    const _config = config.getInCluster();

    const inventoryV2Scaled = await k8s.scaleDeploymentConfig(_config, INVENTORY_DC_V2, 0);
    console.debug('inventoryV2Scaled: ', inventoryV2Scaled);

    try {
        const inventoryVirtualServiceDeleted = await k8s.deleteObject(_config, API_GROUP, API_VERSION, VIRTUAL_SERVICES_KIND_PLURAL, inventoryVirtualService.metadata.name);
        console.debug('inventoryVirtualServiceDeleted: ', inventoryVirtualServiceDeleted);
        const catalogVirtualServiceDeleted = await k8s.deleteObject(_config, API_GROUP, API_VERSION, VIRTUAL_SERVICES_KIND_PLURAL, catalogVirtualService.metadata.name);
        console.debug('catalogVirtualServiceDeleted: ', catalogVirtualServiceDeleted);
    } catch (err) {
      console.error('Error while deleting virtual services!', err);
    }

    try {
      const inventoryDestinationRuleDeleted = await k8s.deleteObject(_config, API_GROUP, API_VERSION, DESTINATION_RULES_KIND_PLURAL, inventoryDestinationRule.metadata.name);
      console.log('inventoryDestinationRuleDeleted: ', inventoryDestinationRuleDeleted);
      const catalogDestinationRuleDeleted = await k8s.deleteObject(_config, API_GROUP, API_VERSION, DESTINATION_RULES_KIND_PLURAL, catalogDestinationRule.metadata.name);
      console.log('catalogDestinationRuleDeleted: ', catalogDestinationRuleDeleted);
    } catch (err) {
      console.error('Error while deleting destination rules!', err);
    }
    
    return {success: true};
  } catch (err) {
    console.error('Error: ', err)
    return {success: false, error: err};
  }
}

module.exports.applyDefaultConfig = main;