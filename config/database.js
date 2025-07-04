import { Sequelize } from "sequelize";

//Parametros: (nombre de la base de datos) - usuario - password
export const sequelize = new Sequelize("peluditosPFS", "adminpeluditos", "1234?postgres", {
    host: "postgres-peluditos-web.postgres.database.azure.com",
    dialect: "postgres",
    dialectOptions: {
        ssl: {
            require: true, 
            rejectUnauthorized: false 
        }
    }
});

