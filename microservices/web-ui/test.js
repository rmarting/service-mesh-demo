/* eslint no-console:0 */
//
// Use a Custom Resource Definition to extend the Kubernetes API and the client.
//
const Client = require('kubernetes-client').Client
const config = require('kubernetes-client').config

const crd = require('./crontabs-crd.json')
const foo = require('./crontab-foo.json')

async function main () {
  try {
    const client = new Client({ config: config.fromKubeconfig(), version: '1.11' })


    const end = await client.apis['apiextensions.k8s.io'].v1beta1.customresourcedefinitions('crontabs.stable.example.com').delete()

    //
    // Create the CRD with the Kubernetes API
    //
    const create = await client.apis['apiextensions.k8s.io'].v1beta1.customresourcedefinitions.post({ body: crd })
    console.log('Create: ', create)

    //
    // Add endpoints to our client
    //
    client.addCustomResourceDefinition(crd)

    //
    // List all the resources of the new type
    //
    const all = await client.apis['stable.example.com'].v1.namespaces('coolstore-ng').crontabs.get()
    console.log('All: ', all)

    const newCrontab = await client.apis['stable.example.com'].v1.namespaces('coolstore-ng').crontabs.post({ body: foo })
    console.log('newCrontab: ', newCrontab)

    //
    // Get a specific resources.
    //
    const one = await client.apis['stable.example.com'].v1.namespaces('coolstore-ng').crontabs('foo').get()
    console.log('One: ', one)


    const oneLess = await client.apis['stable.example.com'].v1.namespaces('coolstore-ng').crontabs('foo').delete()
    //console.log('oneLess: ', oneLess)


    //
    const virtualServicesCrd = await client.apis['apiextensions.k8s.io'].v1beta1.customresourcedefinitions('virtualservices.networking.istio.io').get()
    console.log('virtualServicesCrd', virtualServicesCrd);
    client.addCustomResourceDefinition(virtualServicesCrd.body)

    const virtualServices = await client.apis['networking.istio.io'].v1alpha3.namespaces('coolstore').virtualservices.get();
    console.log('virtualServices: ', virtualServices)
  } catch (err) {
    console.error('Error: ', err)
  }
}

main()