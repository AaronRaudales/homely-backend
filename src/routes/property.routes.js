import { Router } from "express";
import { methods as propertyController } from "../controllers/property.controller";
const router = Router();

//POST
router.post("/add",  propertyController.addProperty);

//************************************************************************** */

// GET
router.get("/", propertyController.getProperty);

 //PARA FEED DE CLIENTE, SOLO PROPIEDADES DISPONIBLES PARA RESERVAR (ESTADO=1 Y RESERVACION =1)
 router.get("/available", propertyController.getAvailableProperties);

    // GET PARA TRAER LAS PROPIEDADES DE UN USUARIO EN ESPECIFICO
router.get("/own/:idUsuario", propertyController.getUserProperties);

    //PARA FEED DE ANFITRION, SOLO PROPIEDADES CON "ESTADO" DISPONIBLE (=1)
router.get("/active/:idUsuario", propertyController.getUserActiveProperties);

//******************************************************************************** */

// PUT
    // ACTUALIZA CUALQUIER PROPIEDAD( SIN TOMAR EN CUENTA EL ID DEL USUARIO) 
router.put("/edit", propertyController.updateProperty);

// PARA ACTUALIZAR LAS PROPIEDADES DE UN USUARIO EN ESPECIFICO
router.put("/edit-property", propertyController.updateUserProperty);

// DELETE
router.delete("/delete/:idPropiedad", propertyController.deleteProperty);

//POST, crear propiedades favoritas
router.post("/add/favorite/:idUsuario", propertyController.addFavoriteProperty);

//get, traer propiedades favoritas de un usuario
router.get("/available/favorite/:idUsuario", propertyController.getUserFavoriteProperties);

//get, traer todas las prpiedades para el feed de clientes
router.get("/available/:idUsuario", propertyController.getAvailableClientProperties);

// eliminar propiedades favoritas
router.delete("/delete/favorite/:idUsuario/:idPropiedad", propertyController.deleteFavoriteProperty);

// Actualizar estado de reservacion de una propiedad
router.put("/edit/reservationS", propertyController.updatePropertyReservationState);

export default router;