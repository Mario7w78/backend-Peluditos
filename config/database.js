import { Sequelize } from "sequelize";

//Parametros: (nombre de la base de datos) - usuario - password
export const sequelize = new Sequelize("peluditosPFS", "postgres", "admin", {
    host: "localhost",
    dialect: "postgres"
});

