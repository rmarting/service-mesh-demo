#!/bin/bash

# Environment
. ./0-environment.sh

oc delete all,secrets,sa,configmaps,deployments,ingresses,clusterroles,clusterrolebindings,virtualservices,destinationrules,customresourcedefinitions,templates --selector=app=kiali -n istio-system