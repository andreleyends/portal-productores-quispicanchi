# Productores de Quispicanchi

Catálogo web de productos de las familias y asociaciones productoras de la provincia de Quispicanchi, Cusco.

El sitio es de demostración: los productores, precios y productos incluidos son ejemplos.

## Cómo actualizar el catálogo

Todo el contenido está en un solo archivo: `js/datos.js`. Se puede abrir con el Bloc de notas o con cualquier editor de texto.

### Agregar un productor

En la lista `productores`, copia un bloque existente, pégalo debajo y cambia los datos:

```js
{
  id: "quesos-maria",                 // nombre corto único, sin espacios ni tildes
  nombre: "Quesos Doña María",
  tipo: "Familia productora",
  distrito: "Urcos",                  // debe estar en la lista de distritos
  lugar: "Comunidad de Muñapata",     // opcional, puede quedar ""
  resumen: "Quesos madurados hechos en casa.",
  historia: "Uno o dos párrafos sobre quiénes son y cómo trabajan.",
  whatsapp: "987654321",              // 9 números, sin +51
  logo: "img/fotos/logo-maria.jpg",   // opcional, puede quedar ""
  ejemplo: false                      // false = productor real
},
```

### Agregar un producto

En la lista `productos`, copia un bloque y cambia los datos:

```js
{
  id: "queso-madurado",
  nombre: "Queso madurado",
  categoria: "lacteos",               // id de una categoría
  productor: "quesos-maria",          // id del productor
  precio: 25, unidad: "molde de 1 kilo",   // precio 0 = "Consultar precio"
  descripcion: "Dos o tres frases sencillas.",
  disponible: "Todo el año.",
  foto: "img/fotos/queso-madurado.jpg",    // opcional
  destacado: true                     // true = aparece en la página de inicio
},
```

Cuidado con las comas: cada bloque termina en `},` y cada dato en una coma, menos el último de la lista.

### Fotos

1. Crea la carpeta `img/fotos/` y guarda ahí las fotos (formato JPG o WebP, horizontales, de unos 800 × 600 píxeles y menos de 200 KB).
2. Escribe la ruta en el campo `foto` del producto o `logo` del productor.

Si un producto no tiene foto, se muestra el dibujo de su categoría.

### Recibir las inscripciones

En `config`, al inicio de `js/datos.js`:

- `whatsappInscripciones`: número que recibe los mensajes del formulario "Quiero aparecer".
- `correoInscripciones`: correo que recibe esos mensajes.
- `esDemo`: cámbialo a `false` para quitar el aviso de "sitio de demostración".

## Ver el sitio en tu computadora

Abre `index.html` con doble clic. No necesita instalar nada.

## Publicar los cambios

El sitio se publica con GitHub Pages desde la rama `main`. Después de editar:

```
git add .
git commit -m "Actualiza catálogo"
git push
```

En uno o dos minutos los cambios aparecen en la dirección pública.

## Estructura

| Archivo | Para qué sirve |
|---|---|
| `index.html` | Estructura de la página |
| `css/estilos.css` | Colores, letras y diseño |
| `js/datos.js` | Productores, productos y configuración |
| `js/app.js` | Buscador, filtros, WhatsApp y formulario |
| `img/` | Ilustraciones e ícono |
