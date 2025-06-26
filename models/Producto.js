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
    precio:{
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

Producto.belongsTo(Categoria,{
    foreignKey: "productoid",
    targetKey: "id",
})

Categoria.hasMany(Producto,{
    foreignKey: "cateogoriaid",
    targetKey: "id",
})