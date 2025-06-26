import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";


export const Categoria = sequelize.define("Categoria", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
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