import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { Producto } from "./Producto.js";

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

Categoria.hasMany(Producto,{
    foreignKey: "categoria_id",
    as: "productos"
})

Producto.belongsTo(Categoria,{
    foreignKey: "categoriaId",
    as: "categoria"
})
