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
    nombresCompletos: {
        type: DataTypes.STRING,
        defaultValue: "Sin especificar"
    },
    apellidosCompletos: {
        type: DataTypes.STRING,
        defaultValue: "Sin especificar"
    },
    direccion: {
        type: DataTypes.STRING,
        defaultValue: "Sin especificar"
    },
    ciudad: {
        type: DataTypes.STRING,
        defaultValue: "Sin especificar"
    },
    codigoPostal: {
        type: DataTypes.STRING,
        defaultValue: "Sin especificar"
    },
    departamento: {
        type: DataTypes.STRING,
        defaultValue: "Sin especificar"
    },
    telefono: {
        type: DataTypes.STRING,
        defaultValue: "Sin especificar"
    },
    metodoPago: {
        type: DataTypes.STRING,
        defaultValue: "Sin especificar"
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

