Entrega Final Curso Desarrollo Backend Avanzado

(/Entrega Final Backend ------> Estructura del proyecto
   /src
        /controllers
            carts.controller              # Para usar populate
            products.controller           
       /data
            carts.json                    # Archivo JSON con datos de carritos
            products.json                 # Archivo JSON con datos de productos
        /managers
            CartManager.js                # Clase para gestionar carritos
            ProductManager.js             # Clase para gestionar productos
        /models 
            Cart.js
            Products.js
       /public 
            client.js
            index.HTML
            /css
               styless.css                # Añadir estilos a la web
       /routers
            carts.router.js               # Rutas relacionadas con carritos
            products.router.js            # Rutas relacionadas con productos
            views.router.js               # Rutas relacionadas al producto mostrados en la Web
       /views
            productDetail.handlebars      # pagina de detalles de los productos
            products.handlebars           # pagina principal (donde se muestran los productos)
            realtimeProducts.handlebars   # productos en tiempo real 
            /layouts
                main.handlebars           # estructura HTML base
    app.js                                # Configuración principal del servidor
    utils.js                              # Funciones auxiliares (opcional)
    .env
.gitignore
package.json 
package-lock.json                          # Archivos de dependencias  )

-------------------------------------------------------------------------------------------------

         Web principal --------> http://localhost:8080/products

     En la web por ahora se pueden ver los productos, si tocas uno te lleva a otra 
        pagina que te muestra los detalles del producto, si tocas el boton de
      agregar al carrito, se agrega al un carrito que tiene su id en el codigo

-----------------------------Pruebas con POSTMAN para Productos----------------------------------
Ejemplo 0: Sin parámetros <3
URL POST: http://localhost:8080/api/products
Resultado esperado: Agrega un producto a la base de datos 

          (Para las pruebas de POSTMAN los productos estan separados por paginas,
                            cada pagina, tiene 10 productos)

Ejemplo 1: Sin parámetros   <3
URL GET: http://localhost:8080/api/products
Resultado esperado: Muestra 10 productos de la base de datos (esta implementado ya que si tuviera 1000 productos tardaria en mostrarse todos)

Ejemplo 2: Con query para categoría <3
URL: http://localhost:8080/api/products?query=Electronics
Resultado esperado: Muestra los primeros 10 productos que sean de la categoría electronics. 
(si le pongo un limit=(cant productos de mi base de datos)), sirve para mostrar los productos de la categoria electronics de toda la BD.

Ejemplo 3: Con sort ascendente    <3
URL GET: http://localhost:8080/api/products?sort=asc
Resultado esperado: Muestra los primeros 10 productos ordenados de menor a mayor precio
               si pongo: http://localhost:8080/api/products?sort=asc&page=2
               Resultado esperado: Los 10 productos de la 2da pagina de menor a mayor precio

Ejemplo 4: Con page      <3
URL GET: http://localhost:8080/api/products?page=2
Resultado esperado: Muestra los productos en la segunda página.

-----------------------------Pruebas con POSTMAN para Carritos----------------------------------

Ejemplo 0:  Crear un carrito <3
URL POST: http://localhost:8080/api/carts       --> tocar body --> none
Resultado esperado: Muestra el carrito creado con su ID

Ejemplo 1: Agregar un producto al carrito <3
URL POST: http://localhost:8080/api/carts/<cid>/products/<pid>    
         CAMBIAR <sid> por el id del carrito y <pid> con el id del producto que quiera agregar al carrito
         AGREGAR un {"quantity": 2} <----- en el ---> body --> raw   
         que es la cant de ese producto que quiero agregar al producto
Resultado esperado: Muestra mensaje de pruducto agregado al carrito correctamente

Ejemplo 2: Buscar un carrito con los productos poblados   <3
URL GET:  http://localhost:8080/api/carts/<sid>     ---> CAMBIAR <sid> con el ID del carrito
Resultado esperado: Muestra el carrito y en donde va el array de products = []    muestra los datos de los productos que estan dentro de ese carrito, esto gracias al populate.

Ejemplo 3: Eliminar un producto del carrito   <3
URL DELETE:   http://localhost:8080/api/carts/<cid>/products/<pid>    
         CAMBIAR <sid> por el id del carrito y <pid> con el id del producto que quiera eliminar
Resultado esperado: Muestra un mensaje de producto eliminado correctamente y como queda el carrito sin el producto eliminado

Ejemplo 4: Actualizar el quiantity (cantidad de ese producto que hay en el carrito) <3
URL PUT:   http://localhost:8080/api/carts/<cid>/products/<pid>
           CAMBIAR <sid> por el id del carrito y <pid> con el id del producto que le quiera actualizar la cantidad 
           AGREGAR un {"quantity": 5} <----- la cantidad que quiero actualizar 
Resultado esperado: Actualiza el quantity y muestra el carrito entero

Ejemplo 5: Vaciar el carrito <3
URL DELETE:   http://localhost:8080/api/carts/<cid>
Resultado esperado: Muestra mensaje de que se vacio correctamente y muestra como quedo el carrito

------------------------------------------------------------------------------------------------
estudiante: Sofía Micaela Cortez
                             
