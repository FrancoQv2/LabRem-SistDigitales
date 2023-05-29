import express from "express"
import { digitalController } from "../controllers/digital.controller.js"
import { uartController } from "../controllers/uart.controller.js"
import { i2cController } from "../controllers/i2c.controller.js"

const { getLaboratorios, getLaboratorio, getEnsayosUsuario, deleteEnsayo, deleteLaboratorio, postLaboratorio, getEnsayos, updateLaboratorio } = digitalController
const { getEnsayosUART, postEnsayoUART } = uartController
const { getEnsayosI2C, postEnsayoI2C } = i2cController

const digitalRouter = express.Router()

// -----------------------------------------------------
// Endpoints - Laboratorios de Sistemas Digitales
// -----------------------------------------------------

digitalRouter.route("/")
    .get(getLaboratorios)
    .post(postLaboratorio)

digitalRouter.route("/uart")
    .get(getEnsayosUART)
    .post(postEnsayoUART)

digitalRouter.route("/i2c")
    .get(getEnsayosI2C)
    .post(postEnsayoI2C)

// -----------------------------------------------------
// Endpoints para Gestión
// -----------------------------------------------------

digitalRouter.route("/laboratorios/:idLaboratorio")
    .get(getLaboratorio)
    .post(updateLaboratorio)
    .delete(deleteLaboratorio)

digitalRouter.route("/ensayos/:idLaboratorio")
    .get(getEnsayos)

digitalRouter.route("/ensayos/:idEnsayo")
    .delete(deleteEnsayo)

// -----------------------------------------------------
// Endpoints con pasaje de parametro en la URL
// -----------------------------------------------------

digitalRouter.route("/:idLaboratorio")
    .get(getLaboratorio)

digitalRouter.route("/:idLaboratorio/:idUsuario")
    .get(getEnsayosUsuario)

export default digitalRouter
