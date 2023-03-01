import { sequelize } from "../index.js";
import { QueryTypes } from "sequelize";

const idLaboratorio = 1;

const uartController = {};

/**
 * -----------------------------------------------------
 * Function - postLabuart
 * -----------------------------------------------------
 */
uartController.postLabuart = (req, res) => {
  const {
    idUsuario,
    velocidad,
    cantidadBitDato,
    paridad,// false par, true impar
    cantidadBitParada,
    mensaje
  } = req.body;

  if ( velocidad != 300 &&
       velocidad != 600 &&
       velocidad != 1200 &&
       velocidad != 2400 &&
       velocidad != 4800 &&
       velocidad != 9600 &&
       velocidad != 19200 &&
       velocidad != 38400 &&
       velocidad != 57600 &&
       velocidad != 115200 &&
       velocidad != 230400 &&
       velocidad != 460800 &&
       velocidad != 921600 ) {
    res.status(400).json("la velocidad seteada no es uno de los valores validos");
      newEnsayo.cantidadBitDato = ensayo.datosEntrada.cantidadBitDato
  } else if ( cantidadBitDato < 1 ) {
    res.status(400).json("la cantidad de bits del dato es 0 o negativo");
  } else if ( cantidadBitParada != 0 &&
              cantidadBitParada != 1 &&
              cantidadBitParada != 2) {
    res.status(400).json("la cantidad de bit de parada no es 0, 1 o 2");
  }
  else {
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
      res.status(200).json("Parámetros correctos");
    } catch (error) {
      console.error("-> ERROR postLabuart:", error);
    }
  }
};

export { uartController };
