RUTAS PARA VER TODOS LOS DATOS DE LOS JSON (GET)
localhost:3000/productos
localhost:3000/pedidos
localhost:3000/users

RUTAS DELETE 

localhost:3000/pedidos/delete/:id (elimina pedido)
localhost:3000/users/delete/:id  (elimina usuario y los pedidos del usuario)

RUTAS  POST 

localhost:3000/users/newUsers  (crear nuevo usuario) JSON PARA POSTMAN:
{
    "nombre": "prueba",
    "apellido": "prueba",
    "email": "prueba@gmail.com",
    "contraseña": "prueba",
    "direccion": "prueba",
    "telefono": "prueba"
  }
localhost:3000/users/login  (iniciar sesion) JSON PARA INICIAR SESION(crear antes el usuario)
{
    "email": "prueba@gmail.com",
    "contraseña": "prueba",
}
localhost:3000/productos/newProduct  (crear nuevo producto) JSON PARA CREAR PRODUCTO:
{
    "nombre": "prueba",
    "descripcion": "prueba",
    "precio": "prueba",
    "marca": "prueba"
  }

RUTAS GET

localhost:3000/pedidos/byid/:id (consultar productos por id)
localhost:3000/productos/bymarca/:marca  (consultar productos por marca)

RUTAS PUT

localhost:3000/productos/update/:id  (modificar datos de un producto)

{
    "nombre": "cambio",
    "descripcion": "cambio",
    "precio": "cambio",
    "marca": "cambio"
  }





