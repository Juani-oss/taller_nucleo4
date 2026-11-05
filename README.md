# Catalogo de productos de computacion

Aplicacion Angular con catalogo de productos, sesiones locales y roles Administrador y Estandar.

## Instalar

```bash
npm install
```

## Ejecutar con Firestore

La aplicacion usa Firestore por defecto. La primera vez, activa Firestore en la consola de Firebase y carga los datos:

```bash
npm run migrar
npm start
```

## Ejecutar con json-server

En `src/app/app.config.ts` cambia `DatosFirestore` por `DatosApi` e importalo desde `./services/datos-api`. Luego ejecuta en dos terminales:

```bash
npm run api
npm start
```

## Usuarios de prueba

| Rol | Correo | Contrasena |
|---|---|---|
| Administrador | admin@tienda.com | admin123 |
| Estandar | usuario@tienda.com | usuario123 |

## Rutas

| Ruta | Acceso |
|---|---|
| `/login`, `/registro` | Publico |
| `/catalogo` | Usuarios con sesion |
| `/panel` | Solo administradores |

## Tests

```bash
npm test -- --watch=false
```
