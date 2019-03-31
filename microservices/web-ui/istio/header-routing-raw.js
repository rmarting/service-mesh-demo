/* eslint no-console:0 */
const rp = require('request-promise-native');
const fs = require('fs');
const yaml = require('js-yaml');

const config = require('./config');

const k8s = require('./k8s-helper');

const API_GROUP = "networking.istio.io";
const API_VERSION = "v1alpha3";

const INVENTORY_DC_V2 = 'inventory-v2';

const virtualService = yaml.safeLoad(fs.readFileSync('./istio/header-routing-virtual-service.yaml', 'utf8'));
const destinationRule = yaml.safeLoad(fs.readFileSync('./istio/header-routing-destination-rule.yaml', 'utf8'));

const VIRTUAL_SERVICES_KIND_PLURAL = 'virtualservices';
const DESTINATION_RULES_KIND_PLURAL = 'destinationrules';

async function main () {
  try {
    const _config = config.getInCluster();

    const inventoryV2Scaled = await k8s.scaleDeploymentConfig(_config, INVENTORY_DC_V2, 1);
    console.debug('inventoryV2Scaled: ', inventoryV2Scaled);

    try {
        const virtualServiceDeleted = await k8s.deleteObject(_config, API_GROUP, API_VERSION, VIRTUAL_SERVICES_KIND_PLURAL, virtualService.metadata.name);
        console.log('virtualServiceDeleted: ', virtualServiceDeleted);
    } catch (err) {
      console.debug('virtualServiceDelete Error', err);
    }

    try {
      const destinationRuleDeleted = await k8s.deleteObject(_config, API_GROUP, API_VERSION, DESTINATION_RULES_KIND_PLURAL, destinationRule.metadata.name);
      console.log('destinationRuleDeleted: ', destinationRuleDeleted);
    } catch (err) {
      console.debug('destinationRuleDelete Error', err);
    }
    
    const virtualServiceCreated = await k8s.createObject(_config, API_GROUP, API_VERSION, VIRTUAL_SERVICES_KIND_PLURAL, virtualService);
    //console.log('virtualServiceCreated: ', virtualServiceCreated);

    const destinationRuleCreated = await k8s.createObject(_config, API_GROUP, API_VERSION, DESTINATION_RULES_KIND_PLURAL, destinationRule);
    //console.log('destinationRuleCreated: ', destinationRuleCreated);

    return {success: true};
  } catch (err) {
    console.error('Error: ', err)
    return {success: false, error: err};
  }
}

module.exports.applyHeaderRouting = main;