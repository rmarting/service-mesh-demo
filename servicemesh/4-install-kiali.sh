#!/bin/bash

# Environment
. ./0-environment.sh

echo "Deploy Kiali Definitions ..."

export KIALI_IMAGE_VERSION=${KIALI_VERSION}
export JAEGER_URL="$(oc get route jaeger-query -n ${ISTIO_SYSTEM_NAMESPACE} | awk 'NR>1 {printf ($5 == "edge") ? "https://%s" : "http://%s",$2 }')"
export GRAFANA_URL="$(oc get route grafana -n ${ISTIO_SYSTEM_NAMESPACE} | awk 'NR>1 {printf ($5 == "edge") ? "https://%s" : "http://%s",$2 }')" 
export OPERATOR_NAMESPACE=${KIALI_OPERATOR_NAMESPACE}
export NAMESPACE=${KIALI_NAMESPACE}

bash <(curl -L https://git.io/getLatestKialiOperator)

echo "Deploying Kiali Services. It will take some minutes ..."
sleep 120
