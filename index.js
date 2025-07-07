import express from "express";
import cors from "cors";
import { sequelize } from "./config/database.js";
import { Usuario } from "./models/Usuario.js";
import { Carrito } from "./models/Carrito.js";
import { Categoria } from "./models/Categoria.js";
import { Producto } from "./models/Producto.js";
import { Orden } from "./models/Orden.js";
import { DetalleCarrito } from "./models/detalleCarrito.js";
import { DetalleOrden } from "./models/detalleOrden.js";

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());

async function verificarAndSyncDatabase() {
  try {
    await sequelize.authenticate();
    console.log("Conexion exitosa con la BD");
    //await sequelize.sync({ force: true });
    await sequelize.sync();

    // Crear usuario base si no existe
    await Usuario.findOrCreate({
      where: { email: "admin@peluditos.com" },
      defaults: {
        nombre: "Admin",
        fechaNacimiento: new Date(1990, 0, 1),
        admin: true,
        dni: 12345678,
        password: "admin123", // Hashea en producción
        rol: "admin",
      },
    });
    console.log("Usuario base verificado o creado");
  } catch (e) {
    console.log("Ocurrio un error con lac conexion", e);
  }
}

//iniciar servidor

app.listen(port, () => {
  console.log(`Servidor activo en puerto ${port}`);
  verificarAndSyncDatabase();
});

// USUARIO

// CREAR USUARIO
app.post("/usuario", async (req, res) => {
  const data = req.body;

  if (
    data.nombre &&
    data.fechaNacimiento &&
    data.dni &&
    data.password &&
    data.email &&
    data.rol
  ) {
    const newuser = await Usuario.create(data);
    await Carrito.create({ usuarioId: newuser.id });
    res.status(200).json(newuser);
  } else {
    res.status(400).send("Faltan datos requeridos/no se pudo crear");
  }
});

//Obtener USUARIO POR ID
app.get("/usuario/:id", async (req, res) => {
  const id = req.params.id;
  const userData = await Usuario.findOne({
    where: {
      id: id,
    },
  });
  if (userData) {
    res.json(userData);
  } else {
    res.status(404).send("No se pudo encontrar al usuario");
  }
});

//OBTENER USUARIO POR EMAIL Y PASSWORD (LOGIN)
app.post("/usuario/login", async (req, res) => {
  const { email, password } = req.body;

  if (email && password) {
    const userData = await Usuario.findOne({
      where: {
        email: email,
        password: password,
      },
    });

    if (userData) {
      res.json(userData);
    } else {
      res.status(404).send("No se pudo encontrar al usuario");
    }
  } else {
    res.status(400).send("Faltan datos requeridos");
  }
});

//OBTENER USUARIOS
app.get("/usuario", async (req, res) => {
  const usuarios = await Usuario.findAll();
  res.status(200).json(usuarios);
});

//ELIMINAR USUARIO
app.delete("/usuario/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await Usuario.destroy({
      where: {
        id: id,
      },
    });
    res.status(200).send("Usuario Eliminado correctamente");
  } catch (e) {
    res.status(404).send(e);
  }
});

//DESACTIVAR USUARIO (NO VA A PODER LOGUEARSE)
app.put("/usuario/:id/desactivar", async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  if (data.length !== 0) {
    const usuarioMod = await Usuario.update(data, {
      where: {
        id: id,
      },
      returning: true,
    });
    res.status(202).json(usuarioMod);
  } else {
    res.status(404).send("No se puedo desactivar al Usuario");
  }
});

// PRODUCTO

//CREAR PRODUCTO
app.post("/producto", async (req, res) => {
  const data = req.body;

  if (
    data.nombre &&
    data.presentacion &&
    data.descripcion &&
    data.precioUnitario &&
    data.stock &&
    data.imgurl
  ) {
    const nuevo = await Producto.create(data);
    res.status(200).json(nuevo);
  } else {
    res.status(400).send("Faltan datos requeridos/no se pudo crear");
  }
});

//OBTENER PRODUCTOS
app.get("/producto", async (req, res) => {
  const productos = await Producto.findAll();
  res.status(200).json(productos);
});

//OBTENER PRODUCTOS POR CATEGORIA
app.get("/categoria/:id/producto", async (req, res) => {
  try {
    const data = await Categoria.findOne({
      where: {
        id: req.params.id,
      },
      include: {
        model: Producto,
        as: "productos",
      },
    });
    res.json(data);
  } catch (e) {
    res.status(404).send(e);
  }
});

//OBTENER PRODUCTOS POR NOMBRE (ruta específica para evitar conflicto)
app.get("/producto/nombre/:nom", async (req, res) => {
  try {
    const data = await Producto.findOne({
      where: {
        nombre: req.params.nom,
      },
    });
    res.json(data);
  } catch (e) {
    res.status(404).send(e);
  }
});

//OBTENER PRODUCTO POR ID
app.get("/producto/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Producto.findOne({
      where: {
        id: id,
      },
    });
    res.json(data);
  } catch (e) {
    res.status(404).send(e);
  }
});

import { Op } from "sequelize"; // Asegúrate que esté importado

// BÚSQUEDA POR NOMBRE PARCIAL
app.get("/producto/buscar/:nom", async (req, res) => {
  try {
    const productos = await Producto.findAll({
      where: {
        nombre: {
          [Op.iLike]: `%${req.params.nom}%`, // búsqueda parcial (insensible a mayúsculas)
        },
      },
    });

    if (productos.length === 0) {
      return res.status(404).json({ mensaje: "No se encontraron productos." });
    }

    res.json(productos);
  } catch (e) {
    console.error("Error al buscar producto:", e);
    res.status(500).json({ mensaje: "Error en la búsqueda." });
  }
});

//CATEGORIA

//OBTENER CATEGORIA

app.get("/categoria", async (req, res) => {
  const data = await Categoria.findAll();
  res.json(data);
});

//CREAR CATEGORIA
app.post("/categoria", async (req, res) => {
  const data = req.body;

  if (data.nombre) {
    const nuevo = await Categoria.create(data);
    res.status(200).json(nuevo);
  } else {
    res.status(400).send("Faltan datos requeridos/no se pudo crear");
  }
});

//CARRITO

//CREAR CARRITO

app.post("/carrito/crear/:usuarioId", async (req, res) => {
  const usuarioId = req.params.usuarioId;
  const usuario = await Usuario.findByPk(parseInt(usuarioId));
  if (usuario) {
    const nuevo = await Carrito.findOrCreate({ usuarioId: usuarioId });
    res.json(nuevo);
  } else {
    res.status(404).send("No existe el usuario");
  }
});

//OBTENER CARRITOS
app.get("/carrito", async (req, res) => {
  try {
    const carritos = await Carrito.findAll({
      include: [
        {
          model: Producto,
          as: "productos",
        },
      ],
    });
    res.json(carritos);
  } catch (e) {
    res.status(404).send(e);
  }
});

//OBTENER CARRITO POR USUARIO
app.get("/carrito/usuario/:usuarioId", async (req, res) => {
  try {
    const carrito = await Carrito.findOne({
      where: { usuarioId: req.params.usuarioId },
      include: {
        model: Producto,
        as: "productos",
        through: {
          attributes: ["cantidad", "precioUnitario", "subtotal"],
        },
      },
    });

    if (!carrito) {
      return res.status(404).send("Carrito no encontrado para este usuario");
    }

    res.json(carrito);
  } catch (e) {
    return res.status(404).send(e);
  }
});

//ELIMINAR UN PRODUCTO DEL CARRITO
app.delete("/carrito/:carritoId/producto/:productoId", async (req, res) => {
  const { carritoId, productoId } = req.params;

  try {
    const carrito = await Carrito.findByPk(carritoId);

    if (!carrito) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    await carrito.removeProducto(productoId);
    res.json({ mensaje: "Producto eliminado del carrito" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al eliminar el producto del carrito" });
  }
});

//CALCULAR TOTAL DEL CARRITO

async function recalcularTotal(carritoId) {
  const detalles = await DetalleCarrito.findAll({
    where: { CarritoId: carritoId },
  });

  const total = detalles.reduce((suma, detalle) => {
    const subtotal = parseFloat(detalle.subtotal) || 0;
    return suma + subtotal;
  }, 0);

  await Carrito.update({ total }, { where: { id: carritoId } });
}
//AGREGAR PRODUCTO A CARRITO

app.post("/carrito/:carritoId/producto", async (req, res) => {
  const { carritoId } = req.params;
  const { productoId, cantidad, precioUnitario } = req.body;

  try {
    const carrito = await Carrito.findByPk(carritoId);
    const producto = await Producto.findByPk(productoId);

    if (!carrito || !producto) {
      return res
        .status(404)
        .json({ error: "Carrito o producto no encontrado" });
    }

    await carrito.addProducto(producto, {
      through: {
        cantidad,
        precioUnitario,
        subtotal: cantidad * precioUnitario,
      },
    });

    await recalcularTotal(carritoId);

    res.send("Producto agregado correctamente al carrito");
  } catch (e) {
    res.status(500).send(e);
  }
});

//ORDEN
app.get("/orden", async (req, res) => {
  const ordenes = await Orden.findAll();
  res.json(ordenes);
});

//CREAR ORDEN DESDE EL CARRITO

app.post("/orden/desde-carrito/:usuarioId", async (req, res) => {
  const { usuarioId } = req.params;

  try {
    const carrito = await Carrito.findOne({
      where: { usuarioId: usuarioId },
      include: {
        model: Producto,
        as: "productos",
        through: {
          attributes: ["cantidad", "precioUnitario", "subtotal"],
        },
      },
    });

    if (!carrito || carrito.productos.length === 0) {
      return res
        .status(400)
        .json({ error: "El carrito está vacío o no existe." });
    }

    const nuevaOrden = await Orden.create({
      usuarioId: usuarioId,
      fecha: new Date(),
    });

    for (const producto of carrito.productos) {
      await nuevaOrden.addProducto(producto.id, {
        through: {
          cantidad: producto.DetalleCarrito.cantidad,
          precioUnitario: producto.DetalleCarrito.precioUnitario,
          subtotal: producto.DetalleCarrito.subtotal,
        },
      });
    }

    await DetalleCarrito.destroy({
      where: { CarritoId: carrito.id },
    });

    res.json({
      mensaje: "Orden generada correctamente desde el carrito.",
      ordenId: nuevaOrden.id,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error al generar la orden desde el carrito." });
  }
});

//OBTENER ORDENES POR USUARIO
app.get("/orden/:usuarioId", async (req, res) => {
  try {
    const ordenes = await Orden.findAll({
      where: { usuarioId: req.params.usuarioId },
      include: {
        model: Producto,
        as: "productos",
      },
    });
    res.json(ordenes);
  } catch (e) {
    res.status(404).send("no se encuentra la orden o el usuario");
  }
});

//CANCELAR ORDEN DE LA ORDEN

app.delete("/orden/:ordenId", async (req, res) => {
  try {
    await Orden.destroy({
      where: { id: req.params.ordenId },
    });
    res.send("Orden cancelada correctamente");
  } catch (e) {
    res.send("No se encontro la orden");
  }
});

// OBTENER ORDEN POR ID
app.get("/orden/detalle/:ordenId", async (req, res) => {
  try {
    const orden = await Orden.findOne({
      where: { id: req.params.ordenId },
      include: {
        model: Producto,
        as: "productos",
      },
    });
    if (!orden) {
      return res.status(404).json({ mensaje: "Orden no encontrada" });
    }
    res.json(orden);
  } catch (e) {
    res.status(500).json({ mensaje: "Error al obtener la orden" });
  }
});

// ACTUALIZAR USUARIO GENERAL (nombre, email, contraseña, dirección, etc.)
app.put("/usuario/:id", async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).send("Usuario no encontrado");
    }

    await usuario.update(data);
    res.status(200).json(usuario);
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).send("Error del servidor");
  }
});

// OBTENER DETALLE DE CARRITO POR ID DEL CARRITO
app.get("/carrito/:carritoId/detalle", async (req, res) => {
  try {
    const carrito = await Carrito.findByPk(req.params.carritoId, {
      include: [
        {
          model: Producto,
          as: "productos",
          through: {
            model: DetalleCarrito,
            attributes: ["id", "cantidad", "precioUnitario", "subtotal"],
          },
        },
      ],
    });

    if (!carrito) {
      return res.status(404).json({ mensaje: "Carrito no encontrado" });
    }

    res.json(carrito);
  } catch (e) {
    console.error("Error al obtener detalles del carrito:", e);
    res
      .status(500)
      .json({ mensaje: "Error al obtener los detalles del carrito" });
  }
});

app.put("/carrito/detalle/:detalleId", async (req, res) => {
  try {
    const { detalleId } = req.params;
    const { cantidad } = req.body;

    if (!cantidad || cantidad <= 0) {
      return res.status(400).json({
        mensaje: "La cantidad debe ser un número positivo",
      });
    }

    // Buscar el detalle del carrito
    const detalleCarrito = await DetalleCarrito.findByPk(detalleId);

    if (!detalleCarrito) {
      return res.status(404).json({
        mensaje: "Detalle del carrito no encontrado",
      });
    }

    const nuevoSubtotal = cantidad * detalleCarrito.precioUnitario;

    // Actualizar la cantidad y el subtotal
    await detalleCarrito.update({
      cantidad: cantidad,
      subtotal: nuevoSubtotal,
    });


    res.send("Cantidad actualizada exitosamente");
  } catch (e) {
    res.status(500).send("Error al actualizar la cantidad del detalle del carrito");
  }
});
