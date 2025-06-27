import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";


export const Producto = sequelize.define("Producto", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING
    },
    presentacion:{
        type: DataTypes.INTEGER
    },
    descripcion:{
        type: DataTypes.STRING
    },
    precio_Unitario:{
        type: DataTypes.DOUBLE
    },
    stock:{
        type: DataTypes.INTEGER
    },
    imgurl:{
        type: DataTypes.STRING
    }
},{
    freezeTableName: true
})



