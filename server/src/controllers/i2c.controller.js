import { db } from "../index.js"

import { delay } from "../lib/delay.js"
import axios from "axios"

const idLaboratorio = 2
const URL_ARDUINO = 'http://192.168.100.75:3031/api/control/arduino'//cambiar por ip arduino

const queries = {
    getEnsayosI2C: "CALL sp_dameEnsayosI2C();",
    postEnsayoI2C: "CALL sp_crearEnsayo(:idUsuario,:datosEntrada,:datosSalida,:idLaboratorio);"
}

const i2cController = {}

// -----------------------------------
// Métodos GET
// -----------------------------------

i2cController.getEnsayosI2C = async (req, res) => {
    console.log("--------------------")
    console.log(`--> getEnsayosI2C - ${JSON.stringify(req.params)}`)

    const data = await db.query(
        queries.getEnsayosI2C
    )

    let dataParsed = []
    data.map((ensayo) => {
        const newEnsayo = {}
        newEnsayo.Usuario   = ensayo.idUsuario
        newEnsayo.Fecha     = ensayo.Fecha
        newEnsayo.Hora      = ensayo.Hora
        // newEnsayo.velocidad  = ensayo.datosEntrada.velocidad
        // newEnsayo.pulsadores = ensayo.datosEntrada.pulsadores
        // newEnsayo.mensaje    = ensayo.datosEntrada.mensaje
        newEnsayo.accion        = ensayo.datosEntrada.accion
        newEnsayo.frecuencia    = `${ensayo.datosEntrada.frecuencia} KHz`
        newEnsayo.direccion     = ensayo.datosEntrada.direccion
        newEnsayo.datos         = ensayo.datosEntrada.datos
        dataParsed.push(newEnsayo)
    })

    await res.status(200).send(dataParsed)
}

// -----------------------------------
// Métodos POST
// -----------------------------------

i2cController.postEnsayoI2C = (req, res) => {
    console.log(`-\n--> postEnsayoI2C - ${JSON.stringify(req.body)}\n---`)

    const {
        idUsuario,
        accion,         // Lectura, Escritura
        frecuencia,     // 100 KHz, 400 KHz, 1000 KHz, 
        direccion,      // Notación 0x
        datos
    } = req.body
console.log(req.body)
    if (
        frecuencia != 100 && 
        frecuencia != 400 && 
        frecuencia != 1000
    ) {
        res.status(400).json("La frecuencia no es válida!")
    } else if (direccion < 0) {
        res.status(400).json("La dirección de memoria no es válida!")
    } else {

        const datosEntrada = {
            accion:     accion,
            frecuencia: frecuencia,
            direccion:  `0x${direccion.toUpperCase()}`,
            datos:      datos
        }

        const datosSalida = {
            // indicadores: pulsadores
        }

        try {
            db.query(
                queries.postEnsayoI2C,
                {
                    replacements: {
                        idUsuario: idUsuario,
                        datosEntrada: JSON.stringify(datosEntrada),
                        datosSalida: JSON.stringify(datosSalida),
                        idLaboratorio: idLaboratorio,
                    }
                }
            )
            res.status(200).json("guardado en base de datos")
        } catch (error) {
            console.error("-> ERROR postEnsayoI2CSave:", error)
        }
    }
}

export { i2cController }
