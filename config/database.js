import { Sequelize } from "sequelize";

//Parametros: (nombre de la base de datos) - usuario - password
export const sequelize = new Sequelize("peluditos", "postgres", "peluditos", {
    host: "localhost",
    dialect: "postgres"
});
