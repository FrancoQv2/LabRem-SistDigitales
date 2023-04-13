import { sequelize, delay} from "../index.js";
import axios from "axios";

const idLaboratorio = 2;

const i2cController = {};

/**
 * -----------------------------------------------------
 * Function - postLabI2C
 * -----------------------------------------------------
 */
i2cController.postEnsayoI2C = async (req, res) => {
  const {
    idUsuario, 
    frecuencia,
    memoria,
    accion, //0 lectura, 1 escritura
    datos 
  } = req.body;

  if (frecuencia < 0) {
    res.status(400).json("la frecuencia es negativa");
  } else if (memoria < 0) {
    res.status(400).json("la direccion de memoria no es valida");
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
       console.error("-> ERROR postensayoI2C:", error);
     }
   }
};

i2cController.postEnsayoI2CSave = (req, res) => {
  const {
    idUsuario, 
    frecuencia,
    memoria,
    accion, //0 lectura, 1 escritura
    datos 
  } = req.body;

  if (frecuencia < 0) {
    res.status(400).json("la frecuencia es negativa");
  } else if (memoria < 0) {
    res.status(400).json("la direccion de memoria no es valida");
  } else {

    const datosEntrada = {
      frecuencia: frecuencia,
      memoria: memoria,
      accion: accion,
      datos,datos
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
      console.error("-> ERROR postEnsayoI2CSave:", error);
    }
  }
};

export { i2cController };
