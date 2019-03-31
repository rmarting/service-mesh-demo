'use strict'
/* eslint no-process-env: 0 no-sync:0 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const merge = require('deepmerge');

const root = process.env.KUBERNETES_CLIENT_SERVICEACCOUNT_ROOT || '/var/run/secrets/kubernetes.io/serviceaccount/';
const caPath = path.join(root, 'ca.crt');
const tokenPath = path.join(root, 'token');
const namespacePath = path.join(root, 'namespace');

function getInCluster () {
    const host = process.env.KUBERNETES_SERVICE_HOST;
    const port = process.env.KUBERNETES_SERVICE_PORT;
    if (!host || !port) {
        throw new TypeError(
        'Unable to load in-cluster configuration, KUBERNETES_SERVICE_HOST' +
        ' and KUBERNETES_SERVICE_PORT must be defined');
    }

    const ca = fs.readFileSync(caPath, 'utf8');
    const bearer = fs.readFileSync(tokenPath, 'utf8');
    const namespace = fs.readFileSync(namespacePath, 'utf8');

    return {
        url: `https://${host}:${port}`,
        ca: ca.replace(/\n/g, ''),
        auth: { bearer: bearer.replace(/\n/g, '') },
        namespace: namespace.replace(/\n/g, '')
    }
}

module.exports.getInCluster = getInCluster;