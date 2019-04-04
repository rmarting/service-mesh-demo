'use strict'

const ISTIO_NETWORKING_API_GROUP = "networking.istio.io";
const ISTIO_API_VERSION = "v1alpha3";

const VIRTUAL_SERVICES_KIND_PLURAL = 'virtualservices';
const DESTINATION_RULES_KIND_PLURAL = 'destinationrules';

const INVENTORY_DC_V1 = 'inventory';
const INVENTORY_DC_V2 = 'inventory-v2';

const CATALOG_DC_V1 = 'catalog';

module.exports.ISTIO_NETWORKING_API_GROUP = ISTIO_NETWORKING_API_GROUP;
module.exports.ISTIO_API_VERSION = ISTIO_API_VERSION;
module.exports.VIRTUAL_SERVICES_KIND_PLURAL = VIRTUAL_SERVICES_KIND_PLURAL;
module.exports.DESTINATION_RULES_KIND_PLURAL = DESTINATION_RULES_KIND_PLURAL;

module.exports.INVENTORY_DC_V1 = INVENTORY_DC_V1;
module.exports.INVENTORY_DC_V2 = INVENTORY_DC_V2;
module.exports.CATALOG_DC_V1 = CATALOG_DC_V1;