import { sequelize, delay } from "../index.js";
import axios from "axios";
const idLaboratorio = 1;

const uartController = {};

/**
 * -----------------------------------------------------
 * Function - postLabUART
 * -----------------------------------------------------
 */
uartController.postEnsayoUART = async (req, res) => {
  const {
    idUsuario,
    velocidad,
    pulsadores,
    mensaje
  } = req.body;

  if ( velocidad != 300    &&
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
       velocidad != 921600 ) {
    console.log("la velocidad seteada no es uno de los valores validos");
    res.status(400).json("la velocidad seteada no es uno de los valores validos");
  } else {
    const url='http://192.168.100.75:3031/api/control/arduino';//cambiar por ip arduino
    const body={
      "Estado" : [3,false,true],
      "Analogico" : [1,1,1]
    };
    let respuestaGet;
    let Msj='';
   try {
     let i=0;
     do {
       respuestaGet = await axios.get(`${url}/${i}`);
       await delay(3000);
       i = i+1;
     } while (respuestaGet.data.Estado[2]);
     switch (respuestaGet.data.Error) {
       case 0:
         
         Msj="laboratorio ok";
         break;
       case 1:
         Msj="Error en el angulo limite de azimut";
         break;
       case 2:
         Msj="Error en el angulo limite de elevacion";
         break;
       default:
         Msj="Error de laboratorio incorrecto";
         break;
     }
     res.status(200).json(Msj);
    } catch (error) {
      console.error("-> ERROR postensayoUART:", error);
    }
  }
};

/**
 * -----------------------------------------------------
 * Function - postLabUART
 * -----------------------------------------------------
 */
uartController.postEnsayoUARTSave = (req, res) => {
  const {
    idUsuario,
    velocidad,
    cantidadBitDato,
    paridad,// false par, true impar
    cantidadBitParada,
    mensaje
  } = req.body;

  if ( velocidad != 300    &&
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
       velocidad != 921600 ) {
    console.log("la velocidad seteada no es uno de los valores validos");
    res.status(400).json("la velocidad seteada no es uno de los valores validos");
  } else if ( cantidadBitDato < 1 ) {
    res.status(400).json("la cantidad de bits del dato es 0 o negativo");
  } else if ( cantidadBitParada != 0 && cantidadBitParada != 1 && cantidadBitParada != 2) {
res.status(400).json("la cantidad de bit de parada no es 0, 1 o 2");
  } else {

    const datosEntrada = {
      velocidad: velocidad,
      cantidadBitDato: cantidadBitDato,
      paridad: paridad,
      cantidadBitParada: cantidadBitParada,
      mensaje: mensaje
    };
    const datosSalida = {
    };
    try {
      sequelize.query(
        "CALL sp_crearEnsayo (:idUsuario,:datosEntrada,:datosSalida,:idLaboratorio);",
        {
          replacements: {
            idUsuario: idUsuario,
            datosEntrada: JSON.stringify(datosEntrada),
            datosSalida: JSON.stringify(datosSalida),
            idLaboratorio: idLaboratorio,
          }
        }
      );
      res.status(200).json("guardado en base de datos");
    } catch (error) {
      console.error("-> ERROR postEnsayoUARTSave:", error);
    }
  }
};

export { uartController };
