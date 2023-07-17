const express = require("express");
const { connectToDB, disconnectFromMongoDB } = require("./src/mongodb");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Middleware para establecer el encabezado Content-Type en las respuestas
app.use((req, res, next) => {
  res.header("Content-Type", "application/json; charset=utf-8");
  next();
});

// Ruta de inicio
app.get("/", (req, res) => {
  res.status(200).end("Bienvenido a la API de Articulos Mobiliario");
});

// Ruta para obtener todos los Articulos Mobiliario
app.get("/mobiliario", async (req, res) => {
  try {
    // Conexión a la base de datos
    const client = await connectToDB();
    if (!client) {
      res.status(500).send("Error al conectarse a MongoDB");
      return;
    }

    // Obtener la colección de articulos mobiliario y convertir los documentos a un array
    const db = client.db("frutas-profe");
    const frutas = await db.collection("mobiliario").find().toArray();
    res.json(frutas);
  } catch (error) {
    // Manejo de errores al obtener los articulos mobiliario
    res.status(500).send("Error al obtener los articulos mobiliarios de la base de datos");
  } finally {
    // Desconexión de la base de datos
    await disconnectFromMongoDB();
  }
});

// Ruta para obtener una articulo mobiliario por su ID
app.get("/mobiliario/codigo/:codigo", async (req, res) => {
  const frutaCodigo = parseInt(req.params.codigo);
  try {
    // Conexión a la base de datos
    const client = await connectToDB();
    if (!client) {
      res.status(500).send("Error al conectarse a MongoDB");
      return;
    }

    // Obtener la colección de articulo mobiliario y buscar un articulo por su ID
    const db = client.db("frutas-profe");
    const artMobiliario = await db.collection("mobiliario").findOne({ codigo: frutaCodigo });
    if (artMobiliario) {
      res.json(artMobiliario);
    } else {
      res.status(404).send("articulo mobiliario no encontrado");
    }
  } catch (error) {
    // Manejo de errores al obtener un articulo mobiliario
    res.status(500).send("Error al obtener un articulo mobiliario de la base de datos");
  } finally {
    // Desconexión de la base de datos
    await disconnectFromMongoDB();
  }
});

// Ruta para obtener un articulo mobiliario por su nombre
app.get("/mobiliario/nombre/:nombre", async (req, res) => {
  const nombreQuery = req.params.nombre;
  let nombreArticuloRegExp = RegExp(nombreQuery, "i");
  try {
    // Conexión a la base de datos
    const client = await connectToDB();
    if (!client) {
      res.status(500).send("Error al conectarse a MongoDB");
      return;
    }

    // Obtener la colección de articulo mobiliario y buscar articulos por su Nombre
    const db = client.db("frutas-profe");
    const nombreArticulo = await db
      .collection("mobiliario")
      .find({ nombre: nombreArticuloRegExp })
      .toArray();
    // const fruta = await db.collection("frutas").find({ nombre: {$regex: frutaNombre}}).toArray();
    if (nombreArticulo.length > 0) {
      res.json(nombreArticulo);
    } else {
      res.status(404).send("articulo mobiliario no encontrado");
    }
  } catch (error) {
    // Manejo de errores al obtener el articulo mobiliario
    res.status(500).send("Error al obtener el articulo mobiliario de la base de datos");
  } finally {
    // Desconexión de la base de datos
    await disconnectFromMongoDB();
  }
});





// Ruta para obtener articulos por su categoria
app.get("/mobiliario/categoria/:categoria", async (req, res) => {
  const categoriaQuery = req.params.categoria;
  let nombreCategoriaRegExp = RegExp(categoriaQuery, "i");
  try {
    // Conexión a la base de datos
    const client = await connectToDB();
    if (!client) {
      res.status(500).send("Error al conectarse a MongoDB");
      return;
    }

    // Obtener la colección de articulos mobiliario y buscar articulos por su categoria
    const db = client.db("frutas-profe");
    const nombreCategoria = await db
      .collection("mobiliario")
      .find({ categoria: nombreCategoriaRegExp })
      .toArray();
    // const fruta = await db.collection("frutas").find({ nombre: {$regex: frutaNombre}}).toArray();
    if (nombreCategoria.length > 0) {
      res.json(nombreCategoria);
    } else {
      res.status(404).send("articulo mobiliario no encontrado");
    }
  } catch (error) {
    // Manejo de errores al obtener articulo mobiliario
    res.status(500).send("Error al obtener el articulo mobiliario de la base de datos");
  } finally {
    // Desconexión de la base de datos
    await disconnectFromMongoDB();
  }
});


// Ruta para agregar un nuevo recurso
app.post("/mobiliario/codigo/:codigo", async (req, res) => {
  const codigoArticulo = parseInt(req.params.codigo);
  const {nombre,precio,categoria} = req.body;
  try {
    if (nuevoArticulo === undefined) {
      res.status(400).send("Error en el formato de datos a crear.");
    }

    // Conexión a la base de datos
    const client = await connectToDB();
    if (!client) {
      res.status(500).send("Error al conectarse a MongoDB");
    }

    const db = client.db("frutas-profe");
    const collection = db.collection("mobiliario");
    await collection.insertOne({ codigo: codigoArticulo,nombre,precio,categoria });
    
    //await collection.insertOne({ codigo: codigoArticulo,nombre:nuevoArticulo.nombre,precio:nuevoArticulo.precio,categoria:nuevoArticulo.categoria });
    
    console.log("Nueva articulo mobiliario creado");
    res.status(201).send(nuevoArticulo);
  } catch (error) {
    // Manejo de errores al agregar un articulo mobiliario
    res.status(500).send("Error al intentar agregar un articulo mobiliario");
  } finally {
    // Desconexión de la base de datos
    await disconnectFromMongoDB();
  }
});



//Ruta para modificar un recurso
app.patch("/mobiliario/codigo/:codigo", async (req, res) => {
  const codigoArticulo = parseInt(req.params.codigo);
  const {precio} = req.body;
  
  try {
    if (!codigoArticulo) {
      res.status(400).send("Error en el formato de datos a crear.");
    }
    
    // Conexión a la base de datos
    const client = await connectToDB();
    if (!client) {
      res.status(500).send("Error al conectarse a MongoDB");
    }
    const db = client.db("frutas-profe");
    const collection = db.collection("mobiliario");
    await collection.updateOne({codigo: codigoArticulo },{$set:{precio}});
    

    console.log("articulo mobiliario Modificado");

    res.status(200).send("se actualizo el precio");
  } catch (error) {
    // Manejo de errores al modificar un articulo mobiliario
    res.status(500).send("Error al modificar articulo mobiliario");
  } finally {
    // Desconexión de la base de datos
    await disconnectFromMongoDB();
  }
});

// Ruta para eliminar un recurso
app.delete("/mobiliario/codigo/:codigo", async (req, res) => {
  const codigoArticulo = parseInt(req.params.codigo);
  try {
    if (!codigoArticulo) {
      res.status(400).send("Error en el formato de datos a crear.");
      return;
    }

    // Conexión a la base de datos
    const client = await connectToDB();
    if (!client) {
      res.status(500).send("Error al conectarse a MongoDB");
      return;
    }

    // Obtener la colección de articulos mobiliario, buscar la articulo por su ID y eliminarla
    const db = client.db("frutas-profe");
    const collection = db.collection("mobiliario");
    const resultado = await collection.deleteOne({ codigo: codigoArticulo });
    console.log(resultado)
    if (resultado.deletedCount === 0) {
      res
        .status(404)
        .send("No se encontró ningun articulo mobiliario con el id seleccionado.");
    } else {
      res.status(204)
      res.send("articulo mobiliario Eliminado");
      
    }
  } catch (error) {
    // Manejo de errores al obtener los articulos mobiliario
    res.status(500).send("Error al eliminar art mobiliario");
  } finally {
    // Desconexión de la base de datos
    await disconnectFromMongoDB();
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
