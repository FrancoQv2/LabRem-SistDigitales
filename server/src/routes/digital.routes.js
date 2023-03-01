import express from "express";
import { digitalController } from "../controllers/digital.controller.js";
import { uartController } from "../controllers/uart.controller.js";
import { i2cController } from "../controllers/i2c.controller.js";

const { getLaboratorios, getLaboratorioById, getEnsayosUsuario, getDeleteEnsayo, getDeleteLaboratorio, postLab, getEnsayos, postModLab } = digitalController;
const { postEnsayoUART } = uartController;
const { postEnsayoI2C } = i2cController;

const digitalRouter = express.Router();

/**
 * -----------------------------------------------------
 * Rutas - Laboratorios de sistemas digitales
 * -----------------------------------------------------
 */
digitalRouter.route("/").get(getLaboratorios).post(postLab);

digitalRouter.route("/i2c").post(postEnsayoI2C);
 
digitalRouter.route("/uart").post(postEnsayoUART);

digitalRouter.route("/modificarLab").post(postModLab); //para el grupo de gestion

/**
 * -----------------------------------------------------
 * Rutas con pasaje de parametro en la URL
 * -----------------------------------------------------
 */
digitalRouter.route("/:idLaboratorio").get(getLaboratorioById);

digitalRouter.route("/delete/ensayo/:idEnsayo").get(getDeleteEnsayo); //para el grupo de gestion

digitalRouter.route("/delete/laboratorio/:idLaboratorio").get(getDeleteLaboratorio); //para el grupo de gestion

digitalRouter.route("/ensayos/:idLaboratorio").get(getEnsayos); //para el grupo de gestion

digitalRouter.route("/:idLaboratorio/:idUsuario").get(getEnsayosUsuario);


export default digitalRouter;
