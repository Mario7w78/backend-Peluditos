import express from 'express';
import cors from 'cors';
import { sequelize } from './config/database';
import { Carrito } from './models/Carrito';
import { Categoria } from './models/Categoria';
import { Producto } from './models/Producto';
import { Usuario } from './models/Usuario';
import { Orden } from './models/Orden';
import { DetalleCarrito } from './models/detalleCarrito';
import { DetalleOrden } from './models/detalleOrden';


const app = express();
const port = 3000;

async function verificarAndSyncDatabase() {
  try {
    await sequelize.authenticate();
    console.log("Conexion exitosa con la BD");
    //await sequelize.sync({force: true});
    await sequelize.sync();
  } catch (e) {

    console.log("Ocurrio un error con lac conexion", e);

  }
}

// USUARIO

// CREAR USUARIO
app.post("/usuario", async (req, res) => {
  const data = req.body;

  if (data.nombre && data.edad && data.dni) {
    const newuser = await Usuario.create(data);
    res.status(200).json(newuser);
  } else {
    res.status(400).send("Faltan datos requeridos/no se pudo crear");
  }
});

//Obtener USUARIO POR ID
app.get("/usuario/:id", async (req, res) => {
  const id = req.params.id();
  const userData = await Usuario.findOne({
    where: {
      id: id,
    }
  })
  res.json(userData);
})

//OBTENER USUARIOS
app.get("/usuario", async (req, res) => {
  const usuarios = await Usuario.findAll();
  res.status(200).json(usuarios);
})

//ELIMINAR USUARIO
app.delete("/usuario/:id", async (req, res) => {
  const id = req.params.id;
  await Usuario.destroy({
    where: {
      id: id
    }
  })
  res.status(200).send('Usuario Eliminado correctamente')

})

//DESACTIVAR USUARIO (NO VA A PODER LOGUEARSE)
app.put("/usuario/:id/desactivar", async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  if (data.length !== 0) {
    const usuarioMod = await Usuario.update(data, {
      where: {
        id: id
      },
      returning: true
    });
    res.status(202).json(usuarioMod);

  } else {
    res.status(404).send("No se puedo desactivar al Usuario");
  }

})

// PRODUCTO

//CREAR PRODUCTO
app.post("/producto", async (req, res) => {
  const data = req.body;

  if (data.nombre && data.presentacion && data.descripcion && data.precio_Unitario && data.stock && data.imgurl) {
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
})

//OBTENER PRODUCTOS POR CATEGORIA
app.get("/categoria/:id/producto", async (req, res) => {
  const data = await Categoria.findOne({
    where: {
      id: req.params.id
    },
    include: {
      model: Producto
    }
  })
  res.json(data);

})

//OBTENER PRODUCTOS POR NOMBRE
app.get("/producto/:nom", async (req, res) => {
  const data = await Producto.findOne({
    where: {
      nombre: req.params.nom
    },
  })
  res.json(data);

})

//OBTENER PRODUCTO POR ID
app.get("/producto/:id", async (req, res) => {
  const id = req.params.id();
  const data = await Producto.findOne({
    where: {
      id: id,
    }
  })
  res.json(data);
})

//CATEGORIA

//OBTENER CATEGORIA

app.get("/categoria", async (req, res) => {

  const data = await Categoria.findAll();
  res.json(data)

})

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

//OBTENER CARRITO POR USUARIO
app.get("/carrito/:usuarioId", async (req, res) => {
  const carrito = await Carrito.findOne({
    where: { usuarioId: req.params.usuarioId },
    include: {
      model: Producto,
      as: "productos",
    }
  });
})

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
    res.status(500).json({ error: "Error al eliminar el producto del carrito" });
  }
});

//AGREGAR PRODUCTO A CARRITO
app.post("/carrito/:carritoId/producto", async (req, res) => {
  const { carritoId } = req.params;
  const { productoId, cantidad, precioUnitario } = req.body;

  try {
    await DetalleCarrito.create({
      carritoId: carritoId,
      productoId: productoId,
      cantidad,
      precioUnitario,
      subtotal: cantidad * precioUnitario
    });

    res.json({ mensaje: "Producto agregado al carrito" });
  } catch (error) {
    res.status(500).json({ error: "Error al agregar producto al carrito" });
  }
});

//ORDEN

//CREAR ORDEN DESDE EL CARRITO

app.post("/orden/desde-carrito/:usuarioId", async (req, res) => {
  const { usuarioId } = req.params;

  try {
    // 1. Buscar el carrito del usuario
    const carrito = await Carrito.findOne({
      where: { usuario_id: usuarioId },
      include: {
        model: Producto,
        as: "productos",
        through: {
          attributes: ["cantidad", "precioUnitario", "subtotal"]
        }
      }
    });

    if (!carrito || carrito.productos.length === 0) {
      return res.status(400).json({ error: "El carrito está vacío o no existe." });
    }

    // 2. Crear la orden
    const nuevaOrden = await Orden.create({
      usuarioId: usuarioId,
      fecha: new Date()
    });

    // 3. Agregar los productos de carrito a la orden
    for (const producto of carrito.productos) {
      await nuevaOrden.addProducto(producto.id, {
        through: {
          cantidad: producto.DetalleCarrito.cantidad,
          precio_unitario: producto.DetalleCarrito.precio_unitario,
          subtotal: producto.DetalleCarrito.subtotal
        }
      });
    }

    await DetalleCarrito.destroy({
      where: { carrito_id: carrito.id }
    });

    res.json({ mensaje: "Orden generada correctamente desde el carrito.", ordenId: nuevaOrden.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al generar la orden desde el carrito." });
  }
});


//OBTENER ORDENES POR USUARIO
app.get("/orden/:usuarioId", async (req, res) => {
  const ordenes = await Orden.findAll({
    where: { usuarioId: req.params.usuarioId },
    include: {
      model: Producto,
      as: "productos",
    }
  });
})


//CANCELAR ORDEN DE LA ORDEN

app.delete("/orden/:ordenId", async (req,res)=>{
    await Orden.destroy({
      where:{id: req.params.ordenId}
    })
})



//iniciar servidor

app.listen(port, ()=>{
    console.log(`Servidor activo en puerto localhost:${port}`)
    verificarAndSyncDatabase();

})

