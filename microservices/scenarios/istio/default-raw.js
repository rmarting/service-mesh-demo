/* eslint no-console:0 */
const rp = require('request-promise-native');
const fs = require('fs');
const yaml = require('js-yaml');

const config = require('./config');
const consts = require('./consts');

const k8s = require('./k8s-helper');
const bf = require('./break-and-fix-helper');

const inventoryVirtualService = yaml.safeLoad(fs.readFileSync('./istio/inventory-virtual-service.yaml', 'utf8'));
const catalogVirtualService = yaml.safeLoad(fs.readFileSync('./istio/catalog-virtual-service.yaml', 'utf8'));
const inventoryDestinationRule = yaml.safeLoad(fs.readFileSync('./istio/inventory-destination-rule.yaml', 'utf8'));
const catalogDestinationRule = yaml.safeLoad(fs.readFileSync('./istio/catalog-destination-rule.yaml', 'utf8'));

function fixServices () {
  bf.fixService(consts.INVENTORY_DC_V1, 'sleep');
  bf.fixService(consts.INVENTORY_DC_V1, 'sleep');
  bf.fixService(consts.INVENTORY_DC_V1, 'exception');
  bf.fixService(consts.INVENTORY_DC_V1, 'exception');

  bf.fixService(consts.CATALOG_DC_V1, 'sleep');
  bf.fixService(consts.CATALOG_DC_V1, 'sleep');
  bf.fixService(consts.CATALOG_DC_V1, 'exception');
  bf.fixService(consts.CATALOG_DC_V1, 'exception');
}

async function main (includeRollout = false, __config = null) {
  try {
    const _config = __config || config.getInCluster();

    fixServices();

    const catalogV1Scaled = await k8s.scaleDeploymentConfig(_config, consts.CATALOG_DC_V1, 2);
    console.debug('catalogV1Scaled: ', catalogV1Scaled);

    const inventoryV1Scaled = await k8s.scaleDeploymentConfig(_config, consts.INVENTORY_DC_V1, 1);
    console.debug('inventoryV1Scaled: ', inventoryV1Scaled);

    const inventoryV2Scaled = await k8s.scaleDeploymentConfig(_config, consts.INVENTORY_DC_V2, 0);
    console.debug('inventoryV2Scaled: ', inventoryV2Scaled);

    if (includeRollout) {
      const rolloutLatestCatalog = await k8s.rolloutLatestDeploymentConfig(_config, consts.CATALOG_DC_V1);
      console.debug('rolloutLatestCatalog: ', rolloutLatestCatalog);
      
      const rolloutLatestInventory = await k8s.rolloutLatestDeploymentConfig(_config, consts.INVENTORY_DC_V1);
      console.debug('rolloutLatestInventory: ', rolloutLatestInventory);
    }

    try {
        const inventoryVirtualServiceDeleted = await k8s.deleteObject(_config, 
          consts.ISTIO_NETWORKING_API_GROUP, 
          consts.ISTIO_API_VERSION, 
          consts.VIRTUAL_SERVICES_KIND_PLURAL, 
          inventoryVirtualService.metadata.name);
        console.debug('inventoryVirtualServiceDeleted: ', inventoryVirtualServiceDeleted);
    } catch (err) {
      console.error('Error while deleting the \'inventory\' virtual service!', err);
    }

    try {
      const catalogVirtualServiceDeleted = await k8s.deleteObject(_config, 
        consts.ISTIO_NETWORKING_API_GROUP, 
        consts.ISTIO_API_VERSION, 
        consts.VIRTUAL_SERVICES_KIND_PLURAL, 
        catalogVirtualService.metadata.name);
      console.debug('catalogVirtualServiceDeleted: ', catalogVirtualServiceDeleted);
  } catch (err) {
    console.error('Error while deleting the \'catalog\' virtual service!', err);
  }

    try {
      const inventoryDestinationRuleDeleted = await k8s.deleteObject(_config, 
        consts.ISTIO_NETWORKING_API_GROUP, 
        consts.ISTIO_API_VERSION, 
        consts.DESTINATION_RULES_KIND_PLURAL, 
        inventoryDestinationRule.metadata.name);
      console.log('inventoryDestinationRuleDeleted: ', inventoryDestinationRuleDeleted);
    } catch (err) {
      console.error('Error while deleting the \'inventory\' destination rule!', err);
    }

    try {
      const catalogDestinationRuleDeleted = await k8s.deleteObject(_config, 
        consts.ISTIO_NETWORKING_API_GROUP, 
        consts.ISTIO_API_VERSION, 
        consts.DESTINATION_RULES_KIND_PLURAL, 
        catalogDestinationRule.metadata.name);
      console.log('catalogDestinationRuleDeleted: ', catalogDestinationRuleDeleted);
    } catch (err) {
      console.error('Error while deleting the \'catalog\' destination rule!', err);
    }
    
    return {success: true};
  } catch (err) {
    console.error('Error: ', err)
    return {success: false, error: err};
  }
}

module.exports.applyDefaultConfig = main;