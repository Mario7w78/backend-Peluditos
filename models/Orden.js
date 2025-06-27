import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { Usuario } from "./Usuario.js";

export const Orden = sequelize.define("Orden", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },    
    fecha: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },

    estado:{
        type: DataTypes.STRING,
        defaultValue: 'Pendiente',
    }
    
},{
    freezeTableName: true
})


Orden.belongsTo(Usuario, {
  foreignKey: "usuarioId",
  as: "usuario"
});
