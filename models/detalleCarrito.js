import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { Carrito } from "./Carrito.js";
import { Producto } from "./Producto.js";


export const DetalleCarrito = sequelize.define("DetalleCarrito", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    precioUnitario: {
        type: DataTypes.DOUBLE,
    },
    cantidad: {
        type: DataTypes.INTEGER,
    },
    subtotal: {
        type: DataTypes.DOUBLE,
    }
    
},{
    freezeTableName: true
})

Carrito.belongsToMany(Producto, { through: DetalleCarrito, as: "productos" });
Producto.belongsToMany(Carrito, { through: DetalleCarrito, as: "carritos" });
