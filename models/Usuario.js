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
    edad: {
        type: DataTypes.DATE
    },
    admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    dni:{
        type: DataTypes.INTEGER,
    },
    password:{
        type: DataTypes.STRING,
    },

    fecharegistro:{
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

