import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { Usuario } from "./Usuario.js";

export const Carrito = sequelize.define("Carrito", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    
},{
    freezeTableName: true
})


Usuario.hasOne(Carrito,{
    foreignKey: "usuarioId",
    as: "carrito"
})

Carrito.belongsTo(Usuario, {
  foreignKey: "usuarioId",
  as: "usuario"
});

