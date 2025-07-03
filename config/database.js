import { Sequelize } from "sequelize";

//Parametros: (nombre de la base de datos) - usuario - password
export const sequelize = new Sequelize("peluditosPFS", "postgres", "[tu contraseña de postgresql]", {
    host: "localhost",
    dialect: "postgres"
});

