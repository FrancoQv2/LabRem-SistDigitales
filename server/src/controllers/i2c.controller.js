import { sequelize } from "../index.js";
import { QueryTypes } from "sequelize";

const idLaboratorio = 2;

const i2cController = {};

/**
 * -----------------------------------------------------
 * Function - postLabI2C
 * -----------------------------------------------------
 */
i2cController.postEnsayoI2C = (req, res) => {
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
      res.status(200).json("Parámetros correctos");
    } catch (error) {
      console.error("-> ERROR postLabI2C:", error);
    }
  }
};

export { i2cController };
