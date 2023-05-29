import axios from "axios"
import { delay } from "./delay.js"

// const URL_ARDUINO = 'http://192.168.100.75:3031/api/control/arduino' // Cambiar por ip arduino
const URL_ARDUINO = "http://172.23.12.125:5033" // IP de wsl vista desde dev-digital

// {"Estado": [ 0, 1, 0],"velocidad": 9600, "Pulsadores": [0,1,1,0], "Serial": "Mensaje serial"}
export async function postArduino(velocidad, pulsadores, mensaje) {
    let respuestaPost

    const body = {
        // [ Laboratorio(0:digital), Sub Laboratorio(0:UART,1:I2C), Inicio del experimento(1:Iniciar,0:Finalizar) ]
        "Estado": [3, false, true],
        "Velocidad": velocidad,
        "Pulsadores": pulsadores, 
        "Serial": mensaje
    }

    try {
        respuestaPost = axios.post(`${URL_ARDUINO}/api/digital`, body)
    } catch (error) {
        console.log(error);
    }
    
    return respuestaPost
}

export async function getArduino() {
    let response
    try {
        response = await axios.get(`${URL_ARDUINO}/api/digital`)
    } catch (error) {
        console.log(error)
    }

    return response
}

// uartController.postEnsayoUART = async (req, res) => {
//     const {
//         idUsuario,
//         velocidad,
//         pulsadores,
//         mensaje
//     } = req.body

//     if (velocidad != 300    &&
//         velocidad != 600    &&
//         velocidad != 1200   &&
//         velocidad != 2400   &&
//         velocidad != 4800   &&
//         velocidad != 9600   &&
//         velocidad != 19200  &&
//         velocidad != 38400  &&
//         velocidad != 57600  &&
//         velocidad != 115200 &&
//         velocidad != 230400 &&
//         velocidad != 460800 &&
//         velocidad != 921600
//     ) {
//         console.log("la velocidad seteada no es uno de los valores validos")
//         res.status(400).json("la velocidad seteada no es uno de los valores validos")
//     } else {
//         const url = 'http://192.168.100.75:3031/api/control/arduino'//cambiar por ip arduino
//         const body = {
//             "Estado": [3, false, true],
//             "Analogico": [1, 1, 1]
//         }

//         let respuestaGet
//         let Msj = ''
        
//         try {
//             let i = 0
//             do {
//                 respuestaGet = await axios.get(`${url}/${i}`)
//                 await delay(3000)
//                 i = i + 1
//             } while (respuestaGet.data.Estado[2])
//             switch (respuestaGet.data.Error) {
//                 case 0:
//                     Msj = "laboratorio ok"
//                     break
//                 case 1:
//                     Msj = "Error en el angulo limite de azimut"
//                     break
//                 case 2:
//                     Msj = "Error en el angulo limite de elevacion"
//                     break
//                 default:
//                     Msj = "Error de laboratorio incorrecto"
//                     break
//             }
//             res.status(200).json(Msj)
//         } catch (error) {
//             console.error("-> ERROR postensayoUART:", error)
//         }
//     }
// }

// i2cController.postEnsayoI2C = async (req, res) => {
//     const {
//         idUsuario,
//         frecuencia,
//         memoria,
//         accion, //0 lectura, 1 escritura
//         datos
//     } = req.body

//     if (frecuencia < 0) {
//         res.status(400).json("la frecuencia es negativa")
//     } else if (memoria < 0) {
//         res.status(400).json("la direccion de memoria no es valida")
//     } else {
//         const body = {
//             "Estado": [3, false, true],
//             "Analogico": [1, 1, 1]
//         }

//         let respuestaGet
//         let Msj = ''

//         try {
//             let i = 0
//             do {
//                 respuestaGet = await axios.get(`${URL_ARDUINO}/${i}`)
//                 await delay(3000)
//                 i = i + 1
//             } while (respuestaGet.data.Estado[2])
//             switch (respuestaGet.data.Error) {
//                 case 0:

//                     Msj = "laboratorio ok"
//                     break
//                 case 1:
//                     Msj = "Error en el angulo limite de azimut"
//                     break
//                 case 2:
//                     Msj = "Error en el angulo limite de elevacion"
//                     break
//                 default:
//                     Msj = "Error de laboratorio incorrecto"
//                     break
//             }
//             res.status(200).json(Msj)
//         } catch (error) {
//             console.error("-> ERROR postensayoI2C:", error)
//         }
//     }
// }