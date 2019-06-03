export KUBERNETES_SERVICE_HOST=master.serverless-6e97.openshiftworkshop.com
export KUBERNETES_SERVICE_PORT=443
export KUBERNETES_CLIENT_SERVICEACCOUNT_ROOT=$(pwd)/istio
export COOLSTORE_GW_ENDPOINT=http://istio-ingressgateway-istio-system.apps.serverless-6e97.openshiftworkshop.com
#export COOLSTORE_SCENARIOS_ENDPOINT=http://scenarios-coolstore.apps.serverless-6e97.openshiftworkshop.com
export COOLSTORE_SCENARIOS_ENDPOINT=http://localhost:8080
export OPENSHIFT_BUILD_NAMESPACE=coolstore-ng
export BASE_DOMAIN=apps.serverless-6e97.openshiftworkshop.com
export WEB_UI_CUSTOM_PORT=8090

npm run dev