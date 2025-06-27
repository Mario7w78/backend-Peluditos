import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { Orden } from "./Orden.js";
import { Carrito } from "./Carrito.js";


export const Usuario = sequelize.define("Usuario", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING
    },
    edad: {
        type: DataTypes.DATE
    },
    admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    dni:{
        type: DataTypes.INTEGER,
    },
    password:{
        type: DataTypes.STRING,
    },

    fecha_registro:{
        type:DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    canlogin:{
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
},{
    freezeTableName: true
})


Usuario.hasMany(Orden, {
  foreignKey: "usuarioId",
  as: "ordenes"
});

Usuario.hasOne(Carrito,{
    foreignKey: "usuarioId",
    as: "carrito"
})
