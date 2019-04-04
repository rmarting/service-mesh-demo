/* eslint no-console:0 */
const fs = require('fs');
const yaml = require('js-yaml');

const config = require('./config');

const consts = require('./consts');

const k8s = require('./k8s-helper');

// This destinatio rule definition defines an outlier detection policy to avoid a cascading effect
const destionationRule = yaml.safeLoad(fs.readFileSync('./istio/circuit-breaker-2-fix-destination-rule.yaml', 'utf8'));

async function main () {
  try {
    const _config = config.getInCluster();

    try {
      const destionationRuleDeleted = await k8s.deleteObject(_config, 
        consts.ISTIO_NETWORKING_API_GROUP, 
        consts.ISTIO_API_VERSION, 
        consts.DESTINATION_RULES_KIND_PLURAL, 
        destionationRule.metadata.name);
      console.log('circuit-breaker-2 destionation rule deleted: ', destionationRuleDeleted);
    } catch (error) {}

    const destionationRuleCreated = await k8s.createObject(_config, 
      consts.ISTIO_NETWORKING_API_GROUP, 
      consts.ISTIO_API_VERSION, 
      consts.DESTINATION_RULES_KIND_PLURAL, 
      destionationRule);
    console.log('circuit-breaker-2 \'fix\' planted: ', destionationRuleCreated);

    return {success: true};
  } catch (err) {
    console.error('Error: ', err)
    return {success: false, error: err};
  }
}

module.exports.applyCircuitBreakerTwoFix = main;