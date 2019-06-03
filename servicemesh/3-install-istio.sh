#!/bin/bash

# Environment
. ./0-environment.sh

#
# Installation with Operator (Maistra)
#

echo "Deploying Istio Operator (Maistra) ..."

oc new-project ${ISTIO_OPERATOR_NAMESPACE}
oc delete limitrange --all -n ${ISTIO_OPERATOR_NAMESPACE}
oc new-project ${ISTIO_SYSTEM_NAMESPACE}
oc delete limitrange --all -n ${ISTIO_SYSTEM_NAMESPACE}

#oc apply -n istio-operator -f https://raw.githubusercontent.com/Maistra/istio-operator/maistra-${MAISTRA_VERSION}/deploy/maistra-operator.yaml
oc apply -n istio-operator -f https://raw.githubusercontent.com/Maistra/istio-operator/maistra-${MAISTRA_VERSION}/deploy/servicemesh-operator.yaml

echo "Waiting some minutes to deploy istio operator pod"
sleep 60

echo "Deploy ..."
cat <<EOF | oc create -n ${ISTIO_SYSTEM_NAMESPACE} -f -
apiVersion: istio.openshift.com/v1alpha3
kind: ControlPlane
metadata:
  name: basic-install
spec:
  istio:
    global:
      proxy:
        resources:
          requests:
            cpu: 100m
            memory: 128Mi
          limits:
            cpu: 500m
            memory: 128Mi

    gateways:
      istio-egressgateway:
        autoscaleEnabled: false
      istio-ingressgateway:
        autoscaleEnabled: false
        ior_enabled: false

    mixer:
      policy:
        autoscaleEnabled: false

      telemetry:
        autoscaleEnabled: false
        resources:
          requests:
            cpu: 100m
            memory: 1G
          limits:
            cpu: 500m
            memory: 4G

    pilot:
      autoscaleEnabled: false
      traceSampling: 100.0

    kiali:
     dashboard:
        user: admin
        passphrase: admin
EOF

echo "Deploying Istio Services. It will take some minutes ..."

for i in {1..10}; 
do 
sleep 30
RESULT=$(oc get controlplane/basic-install -n ${ISTIO_SYSTEM_NAMESPACE} --template='{{range .status.conditions}}{{printf "%s=%s, reason=%s, message=%s\n\n" .type .status .reason .message}}{{end}}' |  awk -F',' '{print $1}')
FLAG=$(echo ${RESULT} |  awk -F',' '{print $1}')
if [ -z ${FLAG} ]
then
  echo "Lets continue..."
  continue
else
  if [ "${FLAG}" == 'Installed=True' ]
  then
  echo "Istio installed correctly"
  break
  else
  echo "Istio not installed correctly: ${RESULT}"
  break
  fi
fi
done
