#!/bin/bash

# Environment
. ./0-environment.sh

oc new-project ${MSA_PROJECT_NAME}

# There no resource limits in our msa... so just in case delelte limits in our namespace
oc delete limitrange --all -n ${MSA_PROJECT_NAME}

oc adm policy add-scc-to-user privileged -z default -n ${MSA_PROJECT_NAME}

# We don't know which route scenarios API has until we have deployed it
COOLSTORE_GW_ENDPOINT="http://$(oc get route istio-ingressgateway -n ${ISTIO_SYSTEM_NAMESPACE} | awk 'NR>1 {print $2}')"
oc process -p GIT_URI=${MSA_GIT_URI} -p GIT_REF=${MSA_GIT_REF} \
  -p COOLSTORE_GW_ENDPOINT=${COOLSTORE_GW_ENDPOINT} \
  -f ../microservices/coolstore-msa-template.yaml | \
  oc apply -n ${MSA_PROJECT_NAME} -f -

# Now we should be able to get the route... to scenarios API
COOLSTORE_SCENARIOS_ENDPOINT="http://$(oc get route scenarios -n ${MSA_PROJECT_NAME} | awk 'NR>1 {print $2}')"
oc set env dc/web-ui COOLSTORE_SCENARIOS_ENDPOINT=${COOLSTORE_SCENARIOS_ENDPOINT}