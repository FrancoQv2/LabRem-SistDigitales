import { db } from "../index.js"

const idLaboratorio = 1

const queries = {
    getEnsayosUART: "CALL sp_dameEnsayosUART();",
    postEnsayoUART: "CALL sp_crearEnsayo(:idUsuario, :datosEntrada, :datosSalida, :idLaboratorio);"
}

const uartController = {}

// -----------------------------------
// Métodos GET
// -----------------------------------

uartController.getEnsayosUART = async (req, res) => {
    console.log("--------------------")
    console.log(`--> getEnsayosUART - ${JSON.stringify(req.params)}`)

    try {        
        const data = await db.query(
            queries.getEnsayosUART
        )
        
        let dataParsed = []
        data.map((ensayo) => {
            const newEnsayo = {}
            newEnsayo.Usuario       = ensayo.idUsuario
            newEnsayo.Fecha         = ensayo.Fecha
            newEnsayo.Hora          = ensayo.Hora
            newEnsayo.velocidad     = ensayo.datosEntrada.velocidad
            newEnsayo.pulsadores    = ensayo.datosEntrada.pulsadores
            newEnsayo.mensaje       = ensayo.datosEntrada.mensaje
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

uartController.postEnsayoUART = async (req, res) => {
    console.log(`-\n--> postEnsayoUART - ${JSON.stringify(req.body)}\n---`)

    const {
        idUsuario,
        velocidad,
        bitsDatos,
        paridad,
        bitsParada,
        pulsadores,
        mensaje,
    } = req.body

    console.log(req.body);

    if (velocidad != 300    &&
        velocidad != 600    &&
        velocidad != 1200   &&
        velocidad != 2400   &&
        velocidad != 4800   &&
        velocidad != 9600   &&
        velocidad != 19200  &&
        velocidad != 38400  &&
        velocidad != 57600  &&
        velocidad != 115200 &&
        velocidad != 230400 &&
        velocidad != 460800 &&
        velocidad != 921600
    ) {
        console.log("La velocidad seteada no es válida")
        res.status(400).json("La velocidad seteada no es válida")
    } else if (
        !Array.isArray(pulsadores) || 
        pulsadores.length !== 4
    ){
        res.status(400).json("Los datos de los pulsadores no son válidos")
    } else {
        const datosEntrada = {
            velocidad:  velocidad,
            bitsDatos:  bitsDatos,
            paridad:    paridad,
            bitsParada: bitsParada,
            pulsadores: pulsadores,
            mensaje:    mensaje
        }

        const datosSalida = {}

        try {
            await db.query(
                queries.postEnsayoUART,
                {
                    replacements: {
                        idUsuario:      idUsuario,
                        datosEntrada:   JSON.stringify(datosEntrada),
                        datosSalida:    JSON.stringify(datosSalida),
                        idLaboratorio:  idLaboratorio
                    }
                }
            )

            res.status(200).json("Parámetros correctos. Guardado en DB")
        } catch (error) {
            console.error("-> ERROR postEnsayoUART:", error)
            res.status(500).json("Falló el ensayo!")
        }
    }
}

export { uartController }
