# backend-comision-1-2023-argentina-programa-4.0

1    [CRUD](#CRUD)

1.1 [inicio](#inicio-del-proyecto)

2   [desarrollo](#desarrollo)

*  [obtener todos los articulos](#obtener-todos-los-articulos)

*  [obtener articulo por id](#obtener-articulos-por-id)

*  [obtener articulo por nombre](#obtener-articulos-por-nombre)

*  [obtener articulo por categoria](#obtener-articulos-por-categoria)


*  [agregar articulo](#agregar-articulo)


* [modificar precio articulo](#modificar-precio-articulo)


* [eliminar articulo](#eliminar-articulo)



3   [ end point del proyecto](#endpoint)




# CRUD
### API de Articulos Mobiliario
objetivo es leer,crear,modificar,eliminar articulos de una base de datos en mongodb https://cloud.mongodb.com/

# inicio-del-proyecto
### dependencias
```js

  "dependencies": {
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "mongodb": "^5.6.0"
  }
  ```


### archivo .env
crear el archivo .env con tus datos del cluster de mongodb https://cloud.mongodb.com/
```js 
PORT=3000
MONGODB_URLSTRING=mongodb+srv://{usuario}:{password}@cluster0.yzzknln.mongodb.net/?retryWrites=true&w=majority
```

### formato JSON para la base de datos
```js
  {
    "codigo": 1,
    "nombre": "Mesa de Comedor de Madera",
    "precio": 200,
    "categoria": "Comedor"
  }
```





# desarrollo

# obtener-todos-los-articulos
endpoint para para obtener todos los Articulos Mobiliario

```js


  // Ruta para obtener todos los Articulos Mobiliario
  app.get("/mobiliario", async (req, res) => {
  try {
    // Conexión a la base de datos
    const client = await connectToDB();
    if (!client) {
      res.status(500).send("Error al conectarse a MongoDB");
      return;
    }

    // Obtener la colección de frutas y convertir los documentos a un array
    const db = client.db("frutas-profe");
    const frutas = await db.collection("mobiliario").find().toArray();
    res.json(frutas);
  } catch (error) {
    // Manejo de errores al obtener las frutas
    res.status(500).send("Error al obtener los articulos mobiliarios de la base de datos");
  } finally {
    // Desconexión de la base de datos
    await disconnectFromMongoDB();
  }
});

```

# obtener-articulos-por-id

endpoint
http://localhost:3000/mobiliario/codigo/{codigo} obtiene un articulo por su codigo

```js

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
```

# obtener-articulos-por-nombre
endpoint
http://localhost:3000/mobiliario/nombre/{nombre}
obtiene  uno o mas articulos por parte de su nombre 


```js

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

```

# obtener-articulos-por-categoria
endpopint 
http://localhost:3000/mobiliario/categoria/{categoria}
obtiene articulos por parte de su nombre de su categoria

```js
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
```

# agregar-articulo
endpoint 
http://localhost:3000/mobiliario/codigo/{codigo}
agregar un art mobiliario con los propiedades en el body

```js

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

```
# modificar-precio-articulo
endpoint 
http://localhost:3000/mobiliario/codigo/{codigo}
actualizar precio de un art mobiliario con las propiedades de precio en el body
```js

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


```
# eliminar-articulo
endpoint
http://localhost:3000/mobiliario/{codigo}
elimina el art mobiliario por el identificador de codigo

```js

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

```


#endpoint
### endpoint con sus metodos

|peticion |url |descriptcion |
|----|-----------------------------|--------------------------|
|GET| http://localhost:3000/mobiliario|muestra todos los art mobiliario|
|GET| http://localhost:3000/mobiliario/codigo/{codigo}|obtiene un art por su codigo|
|GET| http://localhost:3000/mobiliario/nombre/{nombre}|obtiene  uno o mas articulos por parte de su nombre|
|GET| http://localhost:3000/mobiliario/categoria/{categoria}|obtiene articulos por parte de su nombre de su categoria|
|POST| http://localhost:3000/mobiliario/codigo/{codigo}|agregar un art mobiliario con los propiedades en el body|
|PATCH| http://localhost:3000/mobiliario/codigo/{codigo}|actualizar precio de un art mobiliario con las propiedades de precio en el body|
|DELETE| http://localhost:3000/mobiliario/{codigo}|elimina el art mobiliario por el identificador de codigo|



