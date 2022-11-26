import { sequelize } from "../index.js";
import { QueryTypes } from "sequelize";

const idLaboratorio = 1;

const uartController = {};

/**
 * -----------------------------------------------------
 * Function - getEnsayosUART
 * -----------------------------------------------------
 */
uartController.getEnsayosUART = async (req, res) => {
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
    newEnsayo.velocidad = ensayo.datosEntrada.velocidad
    newEnsayo.bitsDatos = ensayo.datosEntrada.bitsDatos
    newEnsayo.paridad = ensayo.datosEntrada.paridad
    newEnsayo.bitsParada = ensayo.datosEntrada.bitsParada
    newEnsayo.mensaje = ensayo.datosEntrada.mensaje
    dataParsed.push(newEnsayo)
  })
  
  console.log(dataParsed);
  await res.send(dataParsed);
};

/**
 * -----------------------------------------------------
 * Function - postLabUART
 * -----------------------------------------------------
 */
uartController.postLabUART = (req, res) => {
  console.log(req.body);
  const {
    idUsuario,
    velocidad,
    bitsDatos,
    bitsParada,
    paridad,  // false impar, true par
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
  } else if ( bitsDatos != 5 &&
              bitsDatos != 6 &&
              bitsDatos != 7 &&
              bitsDatos != 8 &&
              bitsDatos != 9 ) {
      console.log("la cantidad de bits del dato no es 5, 6, 7, 8 o 9");
      res.status(400).json("la cantidad de bits del dato no es 5, 6, 7, 8 o 9");
  } else if ( bitsParada != 0 &&
              bitsParada != 1 &&
              bitsParada != 2) {
      console.log("la cantidad de bit de parada no es 0, 1 o 2");
      res.status(400).json("la cantidad de bit de parada no es 0, 1 o 2");
  } else {

    const datosEntrada = {
      velocidad: velocidad,
      bitsDatos: bitsDatos,
      bitsParada: bitsParada,
      paridad: paridad,
      mensaje: mensaje
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
      console.error("-> ERROR postLabUART:", error);
    }
  }
};

export { uartController };
