import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";



export const Usuario = sequelize.define("Usuario", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING
    },
    fechaNacimiento: {
        type: DataTypes.DATE
    },
    admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    dni:{
        type: DataTypes.BIGINT,
    },
    password:{
        type: DataTypes.STRING,
    },

    fechaRegistro:{
        type:DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    canlogin:{
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    email:{
        type: DataTypes.STRING
    },
    rol:{
        type: DataTypes.STRING
    }
},{
    freezeTableName: true
})

