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
        type: DataTypes.STRING
    },
    descripcion:{
        type: DataTypes.STRING
    },
    precioUnitario:{
        type: DataTypes.DOUBLE
    },
    stock:{
        type: DataTypes.INTEGER
    },
    imgurl:{
        type: DataTypes.TEXT
    }
},{
    freezeTableName: true
})



