#!/bin/bash

# Environment
. ./0-environment.sh

#
# Installation with Operator (Maistra)
#

echo "Deploying Istio Operator (Maistra) ..."

oc new-project ${ISTIO_OPERATOR_NAMESPACE}

oc new-app -f https://raw.githubusercontent.com/Maistra/openshift-ansible/maistra-${MAISTRA_VERSION}/istio/istio_${MAISTRA_TYPE}_operator_template.yaml \
    --param=OPENSHIFT_ISTIO_MASTER_PUBLIC_URL="https://$(minishift ip):8443"

echo "Waiting some minutes to deploy istio operator pod"
sleep 120

echo "Deploy Istio Definition without Kiali and Auth"
cat <<EOF | oc create -n ${ISTIO_OPERATOR_NAMESPACE} -f -
apiVersion: "istio.openshift.com/v1alpha1"
kind: "Installation"
metadata:
  name: "istio-installation"
  namespace: ${ISTIO_OPERATOR_NAMESPACE}
spec:
  deployment_type: openshift
  istio:
    authentication: false
    community: false
    prefix: openshift-istio-tech-preview/
    version: ${MAISTRA_VERSION}
  jaeger:
    prefix: distributed-tracing-tech-preview/
    version: ${JAEGER_VERSION}
    elasticsearch_memory: 1Gi
EOF

echo "Deploying Istio Services. It will take some minutes ..."
sleep 300
