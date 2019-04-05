package com.redhat.cloudnative.inventory;

import java.util.Random;

import org.jboss.logging.Logger;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.redhat.cloudnative.inventory.breakfix.service.BreakFixService;

@Path("/")
@ApplicationScoped
public class InventoryResource {
	private static final Logger LOGGER = Logger.getLogger(InventoryResource.class);
	
	@PersistenceContext(unitName = "InventoryPU")
	private EntityManager em;

	@Inject
	private BreakFixService breakFixService;

	@GET
	@Path("/api/inventory/{itemId}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getAvailability(@PathParam("itemId") String itemId) {
		LOGGER.info("finding itemId: " + itemId);

		Inventory inventory = em.find(Inventory.class, itemId);

		Response.Status httpStatus = Response.Status.OK;

		// Break & Fix
		try {
			this.breakFixService.process();
		} catch (RuntimeException re) {
			inventory = null; // No data
			// If error is not 503 == SERVICE_UNAVAILABLE then outlier detection doesn't seem to work!
			httpStatus = Response.Status.SERVICE_UNAVAILABLE;
		}

		if (inventory == null) {
			inventory = new Inventory();
			inventory.setItemId(null);
			inventory.setQuantity(0);
		}

		return Response.status(httpStatus).entity(inventory).build();
	}

}
