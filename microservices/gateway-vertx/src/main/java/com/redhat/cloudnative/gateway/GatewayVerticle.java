package com.redhat.cloudnative.gateway;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.vertx.core.http.HttpMethod;
import io.vertx.core.json.Json;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.client.WebClientOptions;
import io.vertx.rxjava.core.AbstractVerticle;
import io.vertx.rxjava.ext.web.Router;
import io.vertx.rxjava.ext.web.RoutingContext;
import io.vertx.rxjava.ext.web.client.WebClient;
import io.vertx.rxjava.ext.web.handler.CorsHandler;
import rx.Observable;

public class GatewayVerticle extends AbstractVerticle {
    private static final String MSA_VERSION = "msa-version";
    private static final String END_USER = "end-user";

    private static final Logger LOG = LoggerFactory.getLogger(GatewayVerticle.class);

    private WebClient catalog;
    private WebClient inventory;

    @Override
    public void start() {
        Router router = Router.router(vertx);
        router.route().handler(CorsHandler.create("*").allowedMethod(HttpMethod.GET));
        router.get("/health").handler(ctx -> ctx.response().end(new JsonObject().put("status", "UP").toString()));
        router.get("/api/products").handler(this::products);

        // Server Definition to accept request
        vertx.createHttpServer().requestHandler(router::accept)
            .listen(Integer.getInteger("http.port", config().getInteger("HTTP_PORT", 8080)));

        // Simple Web Clients to invoke other microservices
        catalog = WebClient.create(vertx, new WebClientOptions().setFollowRedirects(false));
        inventory = WebClient.create(vertx, new WebClientOptions().setFollowRedirects(false));
    }

    private void products(RoutingContext rc) {
        String msaVersion = rc.request().getHeader(MSA_VERSION) == null ? "v0" : rc.request().getHeader(MSA_VERSION);
        String user = rc.request().getHeader(END_USER) == null ? "anonymous" : rc.request().getHeader(END_USER);
        LOG.info("user/msaVersion {}/{}", msaVersion, user);
        // Retrieve catalog
        catalog.get(config().getInteger("CATALOG_SERVICE_PORT", 8080), config().getString("CATALOG_SERVICE_HOST", "catalog"), "/api/catalog")
            //.as(BodyCodec.jsonArray())
            .putHeader(MSA_VERSION, msaVersion)
            .putHeader(END_USER, user)
            .rxSend().map(resp -> {
                LOG.info("resp {}/{} \nbody: {}", resp.statusCode(), resp.getHeader("content-type"), resp.body());
                if (resp.statusCode() == 200 && resp.getHeader("content-type").contains("application/json")) {
                    JsonArray products = resp.bodyAsJsonArray();
                    LOG.info("Products {}", products);
                    return products;
                }
                else {
                    //throw new RuntimeException("Invalid response from the catalog: " + resp.statusCode());
                    throw new HttpRuntimeException(
                        "Invalid response from the catalog: " + resp.statusCode(),
                        resp.statusCode());
                }
                //return new JsonArray();
        }).flatMap(products ->
            // For each item from the catalog, invoke the inventory service
            Observable.from(products).cast(JsonObject.class)
            .flatMapSingle(product -> 
                inventory.get(config().getInteger("INVENTORY_SERVICE_PORT", 8080), config().getString("INVENTORY_SERVICE_HOST", "inventory"), "/api/inventory/" + product.getString("itemId"))
                    //.as(BodyCodec.jsonObject()) ==> Don't decode in advance just in case we receive a 500!
                    .putHeader(MSA_VERSION, msaVersion)
                    .putHeader(END_USER, user)
                    .rxSend()
                    .map(resp -> {
                        LOG.info("Resp for {}: status code {}", product.getString("itemId"), (0 + resp.statusCode()));
                        if (resp.statusCode() == 200 && resp.getHeader("content-type").contains("application/json")) {
                            // Decode the body as a json object
                            JsonObject newProduct = product.copy().put("availability", new JsonObject().put("quantity", resp.bodyAsJsonObject().getInteger("quantity")));
                            if (msaVersion.equalsIgnoreCase("v2")) {
                                newProduct.put("discount", 0.2);
                            }
                            return newProduct;
                        } 
                        else {
                            //throw new RuntimeException("Invalid response from the catalog: " + resp.statusCode());
                            throw new HttpRuntimeException(
                                "Invalid response from the inventary: " + resp.statusCode(),
                                resp.statusCode());
                        }
                        LOG.warn("Inventory error for {}: status code {}", product.getString("itemId"), resp.statusCode());
                        return product.copy().put("availability", new JsonObject().put("quantity", -1));
                    })
                    /*.subscribe(
                        json -> LOG.info("json: " + json),
                        err -> {product.copy().put("availability", new JsonObject().put("quantity", -1));}
                    )*/
            )
            .toList().toSingle()
        )
        .subscribe(
            list -> {
                rc.response().end(Json.encodePrettily(list));
            },
            error -> {
                JsonObject response = new JsonObject().put("error", error.getMessage());
                if (error instanceof HttpRuntimeException) {
                    response.put("status", ((HttpRuntimeException)error).getStatus());
                }
                rc.response().end(response.toString());
            }
        );
    }
}
