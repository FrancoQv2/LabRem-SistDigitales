import express from "express";
import { sistemasController } from "../controllers/sistemas.controller.js";
import { uartController } from "../controllers/uart.controller.js";
import { i2cController } from "../controllers/i2c.controller.js";

const { getLaboratorios, getLaboratorioById, getEnsayosUsuario } = sistemasController;
const { postLabuart, getEnsayosuart } = uartController;
const { postLabi2c, getEnsayosi2c } = i2cController;

const sistemasRouter = express.Router();

/**
 * -----------------------------------------------------
 * Rutas - Laboratorios de sistemas
 * -----------------------------------------------------
 */
sistemasRouter.route("/").get(getLaboratorios);

sistemasRouter.route("/i2c").get(getEnsayosi2c).post(postLabi2c);

sistemasRouter.route("/uart").get(getEnsayosuart).post(postLabuart);

/**
 * -----------------------------------------------------
 * Rutas con pasaje de parametro en la URL
 * -----------------------------------------------------
 */
sistemasRouter.route("/:idLaboratorio").get(getLaboratorioById);

sistemasRouter.route("/i2c/:idUsuario").get(getEnsayosUsuario);

sistemasRouter.route("/uart/:idUsuario").get(getEnsayosUsuario);

sistemasRouter.route("/:idLaboratorio/:idUsuario").get(getEnsayosUsuario);


export default sistemasRouter;
