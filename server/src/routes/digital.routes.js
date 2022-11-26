import express from "express";

import { digitalController } from "../controllers/digital.controller.js";
import { uartController } from "../controllers/uart.controller.js";
import { i2cController } from "../controllers/i2c.controller.js";

const { getLaboratorios, getLaboratorioById, getEnsayosUsuario } = digitalController;
const { postLabUART, getEnsayosUART } = uartController;
const { postLabI2C, getEnsayosI2C } = i2cController;

const digitalRouter = express.Router();

/**
 * -----------------------------------------------------
 * Rutas - Laboratorios de sistemas
 * -----------------------------------------------------
 */
digitalRouter.route("/").get(getLaboratorios);

digitalRouter.route("/i2c").get(getEnsayosI2C).post(postLabI2C);

digitalRouter.route("/uart").get(getEnsayosUART).post(postLabUART);

/**
 * -----------------------------------------------------
 * Rutas con pasaje de parametro en la URL
 * -----------------------------------------------------
 */
digitalRouter.route("/:idLaboratorio").get(getLaboratorioById);

digitalRouter.route("/:idLaboratorio/:idUsuario").get(getEnsayosUsuario);


export default digitalRouter;
