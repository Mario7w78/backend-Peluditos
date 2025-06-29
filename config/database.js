import { Sequelize } from "sequelize";

//Parametros: (nombre de la base de datos) - usuario - password
export const sequelize = new Sequelize("peluditosPFS", "postgres", "anakin1008", {
    host: "localhost",
    dialect: "postgres"
});

