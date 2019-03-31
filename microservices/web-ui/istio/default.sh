export TOKEN="00CBniyVvNvcyA48Txo_Kkwpg_5zQUb63CdOHcfjDgg"
export API_GROUP=networking.istio.io
export API_VERSION=v1alpha3
export NAMESPACE=coolstore
export ENDPOINT=apis/${API_GROUP}/${API_VERSION}/namespaces/${NAMESPACE}

curl -k \
    -H "Authorization: Bearer $TOKEN" \
    -H 'Content-Type: application/strategic-merge-patch+json' \
    -X PATCH --data '{"spec":{"replicas": 1 }}' \
    https://master.serverless-2e82.openshiftworkshop.com/apis/apps.openshift.io/v1/namespaces/$NAMESPACE/deploymentconfigs/inventory-v2

curl -k  \
	-H "Authorization: Bearer $TOKEN" \
	https://master.serverless-2e82.openshiftworkshop.com/${ENDPOINT}/virtualservices


curl -k \
    -X POST \
    -d @- \
    -H "Authorization: Bearer $TOKEN" \
    -H 'Accept: application/json' \
    -H 'Content-Type: application/json' \
    https://master.serverless-2e82.openshiftworkshop.com/${ENDPOINT}/virtualservices < ./istio/header-routing-virtual-service.json

OBJECT_NAME=$(cat ./istio/header-routing-virtual-service.json | jq -r .metadata.name)

curl -k \
    -X DELETE \
	-H "Authorization: Bearer $TOKEN" \
	https://master.serverless-2e82.openshiftworkshop.com/${ENDPOINT}/virtualservices/${OBJECT_NAME}
	