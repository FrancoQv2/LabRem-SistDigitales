import { sequelize } from "../index.js";
import { QueryTypes } from "sequelize";

const idLaboratorio = 2;

const i2cController = {};

/**
 * -----------------------------------------------------
 * Function - getEnsayosi2c
 * -----------------------------------------------------
 */
i2cController.getEnsayosi2c = async (req, res) => {
  console.log(req.params);

  const response = await sequelize.query(
    "SELECT idUsuario, DATE(fechaHora) AS Fecha, TIME(fechaHora) AS Hora, datosEntrada, datosSalida FROM Ensayos WHERE idLaboratorio = 2;",
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
    newEnsayo.lecturaEscritura = ensayo.datosEntrada.lecturaEscritura
    newEnsayo.datos = ensayo.datosEntrada.datos
    dataParsed.push(newEnsayo)
  })
  
  console.log(dataParsed);
  await res.send(dataParsed);
};

/**
 * -----------------------------------------------------
 * Function - postLabi2c
 * -----------------------------------------------------
 */
i2cController.postLabi2c = (req, res) => {
  const {
    idUsuario, 
    frecuencia,
    memoria,
    lecturaEscritura, //0 lectura, 1 escritura
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
      lecturaEscritura: lecturaEscritura,
      datos,datos
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
      console.error("-> ERROR postLabi2c:", error);
    }
  }
};

export { i2cController };
