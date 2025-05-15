Entrega Final Curso Desarrollo Backend Avanzado

/Entrega Final Backend ------> Estructura del proyecto
   /src
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
            products.handlebars           # pagina principal (donde se muestran los productos)
            realtimeProducts.handlebars   # productos en tiempo real 
            /layouts
                main.handlebars           # estructura HTML base
        /controllers
            carts.controller              # Para usar populate
    app.js                                # Configuración principal del servidor
    utils.js                              # Funciones auxiliares (opcional)
    .env
.gitignore
package.json 
package-lock.json                          # Archivos de dependencias


-----------------------------Pruebas con POSTMAN para Productos----------------------------------

Ver todos los productos directo de la Web --------> http://localhost:8080/products

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

------------------------------------------------------------------------------------------------

estudiante: Sofía Micaela Cortez
                             
