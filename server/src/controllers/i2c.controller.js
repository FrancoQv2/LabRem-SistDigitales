import { sequelize } from "../index.js";
import { QueryTypes } from "sequelize";

const idLaboratorio = 2;

const i2cController = {};

/**
 * -----------------------------------------------------
 * Function - getEnsayosI2C
 * -----------------------------------------------------
 */
i2cController.getEnsayosI2C = async (req, res) => {
  console.log(req.params);

  const response = await sequelize.query(
    "SELECT idUsuario, DATE(fechaHora) AS Fecha, TIME(fechaHora) AS Hora, datosEntrada, datosSalida FROM Ensayos WHERE idLaboratorio = :idLaboratorio;",
    {
      replacements: {
        idLaboratorio: idLaboratorio
      },
      type: QueryTypes.SELECT,
    }
  );

  console.log(response);
  
  let dataParsed = [];
  response.map((ensayo)=>{
    const newEnsayo = {}
    newEnsayo.Usuario = ensayo.idUsuario
    newEnsayo.Fecha = ensayo.Fecha
    newEnsayo.Hora = ensayo.Hora
    newEnsayo.frecuencia = ensayo.datosEntrada.frecuencia
    newEnsayo.memoria = ensayo.datosEntrada.memoria
    newEnsayo.readWrite = ensayo.datosEntrada.readWrite
    newEnsayo.mensaje = ensayo.datosEntrada.mensaje
    dataParsed.push(newEnsayo)
  })
  
  console.log(dataParsed);
  await res.send(dataParsed);
};

/**
 * -----------------------------------------------------
 * Function - postLabI2C
 * -----------------------------------------------------
 */
i2cController.postLabI2C = (req, res) => {
  const {
    idUsuario, 
    frecuencia,
    memoria,
    readWrite, // 0 lectura, 1 escritura
    mensaje
  } = req.body;

  if (frecuencia < 0) {
    res.status(400).json("la frecuencia es negativa");
  } else if (memoria < 0) {
    res.status(400).json("la direccion de memoria no es valida");
  } else {

    const datosEntrada = {
      frecuencia: frecuencia,
      memoria: memoria,
      readWrite: readWrite,
      mensaje
    };

    const datosSalida = {
    };
    
    try {
      sequelize.query(
        "INSERT INTO Ensayos(idUsuario,datosEntrada,datosSalida,idLaboratorio) VALUES(:idUsuario,:datosEntrada,:datosSalida,:idLaboratorio);",
        {
          replacements: {
            idUsuario: idUsuario,
            datosEntrada: JSON.stringify(datosEntrada),
            datosSalida: JSON.stringify(datosSalida),
            idLaboratorio: idLaboratorio,
          },
          type: QueryTypes.INSERT,
        }
      );
      res.status(200).json("Parámetros correctos");
    } catch (error) {
      console.error("-> ERROR postLabI2C:", error);
    }
  }
};

export { i2cController };
