/* eslint no-console:0 */
//
// Use a Custom Resource Definition to extend the Kubernetes API and the client.
//
const Client = require('kubernetes-client').Client
const config = require('kubernetes-client').config

const virtualService = require('./header-routing-virtual-service.json')
const destinationRule = require('./header-routing-destination-rule.json')

async function main () {
  try {
    let client = undefined;
    if (process.env.KUBERNETES_PORT) {
      client = new Client({ config: config.getInCluster() });
      await client.loadSpec()
    } else {
      client = new Client({ config: config.fromKubeconfig(), version: '1.11' })
    }

    console.log('client', client);

    const virtualServicesCrd = await client.apis['apiextensions.k8s.io'].v1beta1.customresourcedefinitions('virtualservices.networking.istio.io').get()
    console.log('virtualServicesCrd', virtualServicesCrd);
    client.addCustomResourceDefinition(virtualServicesCrd.body)
    const destinationRulesCrd = await client.apis['apiextensions.k8s.io'].v1beta1.customresourcedefinitions('destinationrules.networking.istio.io').get()
    console.log('destinationRulesCrd', destinationRulesCrd);
    client.addCustomResourceDefinition(destinationRulesCrd.body)

    //const virtualServices = await client.apis['networking.istio.io'].v1alpha3.namespaces('coolstore').virtualservices.get();
    //console.log('virtualServices: ', virtualServices)

    try {
        const virtualServiceDeleted = await client.apis['networking.istio.io'].v1alpha3.namespaces('coolstore-ng').virtualservices('inventory').delete();
        console.log('virtualServiceDeleted: ', virtualServiceDeleted);
    } catch (err) {}
    
    try {
      const destinationRuleDeleted = await client.apis['networking.istio.io'].v1alpha3.namespaces('coolstore-ng').destinationrules('inventory').delete();
      console.log('destinationRuleDeleted: ', destinationRuleDeleted);
    } catch (err) {}

    const virtualServiceCreated = await client.apis['networking.istio.io'].v1alpha3.namespaces('coolstore-ng').virtualservices.post({ body: virtualService });
    console.log('virtualServiceCreated: ', virtualServiceCreated);

    const destinationRuleCreated = await client.apis['networking.istio.io'].v1alpha3.namespaces('coolstore-ng').destinationrules.post({ body: destinationRule });
    console.log('destinationRuleCreated: ', destinationRuleCreated);

    return {success: true};
  } catch (err) {
    console.error('Error: ', err)
    return {success: false, error: err};
  }
}

module.exports.applyHeaderRouting = main;