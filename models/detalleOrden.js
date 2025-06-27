import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { Orden } from "./Orden.js";
import { Producto } from "./Producto.js";


export const DetalleOrden = sequelize.define("DetalleOrden", {
    
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


Orden.belongsToMany(Producto, {
  through: DetalleOrden, 
  as: "productos"
});

Producto.belongsToMany(Orden, {
  through: DetalleOrden,
  as: "ordenes"
});

