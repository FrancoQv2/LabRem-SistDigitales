import { db } from "../index.js"

const idLaboratorio = 2

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

    try {
        const data = await db.query(
            queries.getEnsayosI2C
        )

        let dataParsed = []
        data.map((ensayo) => {
            const newEnsayo = {}
            newEnsayo.Usuario   = ensayo.idUsuario
            newEnsayo.Fecha     = ensayo.Fecha
            newEnsayo.Hora      = ensayo.Hora
            newEnsayo.accion        = ensayo.datosEntrada.accion
            newEnsayo.frecuencia    = (ensayo.datosEntrada.frecuencia != 1000) ? `${ensayo.datosEntrada.frecuencia} KHz` : `${ensayo.datosEntrada.frecuencia/1000} MHz`
            newEnsayo.direccion     = ensayo.datosEntrada.direccion
            newEnsayo.datos         = ensayo.datosEntrada.datos
            dataParsed.push(newEnsayo)
        })

        await res.status(200).send(dataParsed)
    } catch (error) {
        res.status(404).send("No hay ensayos realizados en este laboratorio!")
    }
}

// -----------------------------------
// Métodos POST
// -----------------------------------

i2cController.postEnsayoI2C = async (req, res) => {
    console.log(`-\n--> postEnsayoI2C - ${JSON.stringify(req.body)}\n---`)

    const {
        idUsuario,
        accion,         // Lectura, Escritura
        frecuencia,     // 100 KHz, 400 KHz, 1000 KHz, 
        direccion,      // Notación 0x
        datos,
        pulsadores
    } = req.body

    console.log(req.body);

    if (
        frecuencia != 100 && 
        frecuencia != 400 && 
        frecuencia != 1000
    ) {
        res.status(400).json("La frecuencia no es válida!")
    } else if (
        direccion < 0
    ) {
        res.status(400).json("La dirección de memoria no es válida!")
    } else if (
        !Array.isArray(pulsadores) || 
        pulsadores.length !== 4
    ){
        res.status(400).json("Los datos de los pulsadores no son válidos")
    } else {

        const datosEntrada = {
            accion:     accion,
            frecuencia: frecuencia,
            direccion:  `0x${direccion.toUpperCase()}`,
            datos:      (datos === "") ? "-" : `0b${datos.toUpperCase()}`,
            pulsadores: pulsadores,
        }

        const datosSalida = {}

        try {
            await db.query(
                queries.postEnsayoI2C,
                {
                    replacements: {
                        idUsuario:      idUsuario,
                        datosEntrada:   JSON.stringify(datosEntrada),
                        datosSalida:    JSON.stringify(datosSalida),
                        idLaboratorio:  idLaboratorio,
                    }
                }
            )

            res.status(200).json("Parámetros correctos. Guardado en DB")
        } catch (error) {
            console.error("-> ERROR postEnsayoI2CSave:", error)
            res.status(500).json("Falló el ensayo!")
        }
    }
}

export { i2cController }
