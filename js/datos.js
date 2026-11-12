/* =====================================================================
   DATOS DEL CATÁLOGO
   Este es el ÚNICO archivo que hay que editar para actualizar el portal.
   Lee el archivo README.md para ver ejemplos paso a paso.
   ===================================================================== */

window.PORTAL = {

  /* ---------- Configuración general ---------- */
  config: {
    nombreSitio: "Productores de Quispicanchi",

    // true = muestra el aviso "sitio de demostración" arriba de la página.
    // Cámbialo a false cuando el catálogo tenga solo productores reales.
    esDemo: true,

    // A dónde llegan las inscripciones del formulario "Quiero aparecer".
    // WhatsApp: 9 dígitos, sin espacios ni +51. Ejemplo: "987654321"
    // Si se deja vacío, WhatsApp le pedirá a la persona elegir el contacto.
    whatsappInscripciones: "",
    // Correo que recibe las inscripciones. Ejemplo: "catalogo@miorganizacion.org"
    correoInscripciones: ""
  },

  /* ---------- Distritos de la provincia ---------- */
  distritos: [
    "Andahuaylillas", "Camanti", "Ccarhuayo", "Ccatca", "Cusipata", "Huaro",
    "Lucre", "Marcapata", "Ocongate", "Oropesa", "Quiquijana", "Urcos"
  ],

  /* ---------- Categorías ----------
     id: nombre corto sin espacios ni tildes (se usa en los productos)
     imagen: ilustración que se muestra cuando el producto no tiene foto */
  categorias: [
    { id: "lacteos",    nombre: "Lácteos",               imagen: "img/cat-lacteos.svg" },
    { id: "granos",     nombre: "Granos y papas",        imagen: "img/cat-granos.svg" },
    { id: "artesania",  nombre: "Artesanía y tejidos",   imagen: "img/cat-artesania.svg" },
    { id: "crianza",    nombre: "Crianza de animales",   imagen: "img/cat-crianza.svg" },
    { id: "hortalizas", nombre: "Verduras y hortalizas", imagen: "img/cat-hortalizas.svg" },
    { id: "miel",       nombre: "Miel y derivados",      imagen: "img/cat-miel.svg" }
  ],

  /* ---------- Productores ----------
     id:        nombre corto único, sin espacios ni tildes
     nombre:    nombre de la marca, familia o asociación
     tipo:      "Asociación", "Familia productora", "Emprendimiento"...
     distrito:  uno de la lista de distritos
     lugar:     comunidad o sector (opcional)
     resumen:   una frase corta
     historia:  uno o dos párrafos sobre quiénes son
     whatsapp:  9 dígitos, sin +51. Si se deja "", el botón abre WhatsApp
                para que el visitante elija el contacto.
     logo:      ruta de la imagen del logo (opcional). Ejemplo: "img/fotos/mi-logo.jpg"
     ejemplo:   true = es un dato de muestra (se muestra la etiqueta "Ejemplo") */
  productores: [
    {
      id: "lacteos-ausangate",
      nombre: "Lácteos Apu Ausangate",
      tipo: "Asociación de productores",
      distrito: "Ocongate",
      lugar: "Comunidad de Lauramarca",
      resumen: "Quesos y yogur hechos con leche fresca de altura.",
      historia: "Somos 18 familias ganaderas que nos juntamos para transformar nuestra leche. Ordeñamos cada mañana y elaboramos el queso el mismo día, cuidando la limpieza en cada paso.",
      whatsapp: "",
      logo: "",
      ejemplo: true
    },
    {
      id: "awana-ccatca",
      nombre: "Awana Wasi Ccatca",
      tipo: "Asociación de tejedoras",
      distrito: "Ccatca",
      lugar: "Comunidad de Kcauri",
      resumen: "Tejidos a mano con lana de alpaca y oveja, teñidos con plantas.",
      historia: "Somos 25 mujeres tejedoras. Hilamos, teñimos con plantas de la zona y tejemos en telar de cintura, como nos enseñaron nuestras madres y abuelas.",
      whatsapp: "",
      logo: "",
      ejemplo: true
    },
    {
      id: "granos-vilcanota",
      nombre: "Granos del Vilcanota",
      tipo: "Familia productora",
      distrito: "Quiquijana",
      lugar: "Sector Pampaquehuar",
      resumen: "Maíz, quinua, habas y papas nativas cultivadas sin químicos.",
      historia: "Nuestra familia siembra en las orillas del río Vilcanota desde hace cuatro generaciones. Usamos abono natural y guardamos nuestras propias semillas.",
      whatsapp: "",
      logo: "",
      ejemplo: true
    },
    {
      id: "cuyes-huaro",
      nombre: "Cuyes Sumaq Huaro",
      tipo: "Emprendimiento familiar",
      distrito: "Huaro",
      lugar: "",
      resumen: "Cuyes criados en galpón limpio y alimentados con alfalfa fresca.",
      historia: "Empezamos con diez cuyes y hoy tenemos un galpón tecnificado. Vendemos cuyes para consumo y también reproductores para otras familias que quieren criar.",
      whatsapp: "",
      logo: "",
      ejemplo: true
    },
    {
      id: "huerta-andahuaylillas",
      nombre: "Huerta Familiar Tika",
      tipo: "Familia productora",
      distrito: "Andahuaylillas",
      lugar: "",
      resumen: "Verduras frescas cosechadas el mismo día de la entrega.",
      historia: "Cultivamos en fitotoldo y a campo abierto, con riego por goteo y abono de nuestra compostera. Armamos canastas semanales para familias y restaurantes.",
      whatsapp: "",
      logo: "",
      ejemplo: true
    },
    {
      id: "miel-marcapata",
      nombre: "Miel Flor de Marcapata",
      tipo: "Asociación de apicultores",
      distrito: "Marcapata",
      lugar: "",
      resumen: "Miel pura de ceja de selva, envasada por los mismos apicultores.",
      historia: "Somos 12 apicultores que cuidamos nuestras colmenas entre el bosque y las chacras. Cosechamos dos veces al año y envasamos sin mezclar ni calentar la miel.",
      whatsapp: "",
      logo: "",
      ejemplo: true
    }
  ],

  /* ---------- Productos ----------
     id:           nombre corto único, sin espacios ni tildes
     nombre:       nombre del producto
     categoria:    id de una categoría de arriba
     productor:    id de un productor de arriba
     precio:       precio referencial en soles (número). Usa 0 para "consultar precio"
     unidad:       por qué se vende: "kilo", "unidad", "frasco de 500 g"...
     descripcion:  dos o tres frases sencillas
     disponible:   cuándo o cómo se consigue (opcional)
     foto:         ruta de la foto (opcional). Ejemplo: "img/fotos/queso.jpg"
     destacado:    true = aparece en la página de inicio */
  productos: [
    {
      id: "queso-fresco",
      nombre: "Queso fresco andino",
      categoria: "lacteos", productor: "lacteos-ausangate",
      precio: 18, unidad: "molde de 1 kilo",
      descripcion: "Queso fresco de leche de vaca, suave y con poca sal. Ideal para el desayuno, con papa sancochada o choclo.",
      disponible: "Todo el año. Pedidos con un día de anticipación.",
      foto: "", destacado: true
    },
    {
      id: "yogur-natural",
      nombre: "Yogur natural",
      categoria: "lacteos", productor: "lacteos-ausangate",
      precio: 8, unidad: "botella de 1 litro",
      descripcion: "Yogur cremoso sin colorantes. También hay con fresa y con sauco.",
      disponible: "Todo el año.",
      foto: "", destacado: false
    },
    {
      id: "mantequilla",
      nombre: "Mantequilla de campo",
      categoria: "lacteos", productor: "lacteos-ausangate",
      precio: 12, unidad: "paquete de 250 gramos",
      descripcion: "Mantequilla batida con crema fresca, sin conservantes.",
      disponible: "Bajo pedido.",
      foto: "", destacado: false
    },
    {
      id: "chalina-alpaca",
      nombre: "Chalina de alpaca",
      categoria: "artesania", productor: "awana-ccatca",
      precio: 85, unidad: "unidad",
      descripcion: "Chalina tejida a mano con lana de alpaca. Abrigadora y suave. Colores naturales o teñidos con plantas.",
      disponible: "Se teje a pedido en 10 días.",
      foto: "", destacado: true
    },
    {
      id: "lliclla",
      nombre: "Lliclla tejida en telar",
      categoria: "artesania", productor: "awana-ccatca",
      precio: 180, unidad: "unidad",
      descripcion: "Manta tradicional con diseños de Ccatca, tejida en telar de cintura. Cada pieza es única.",
      disponible: "Hay modelos listos y también a pedido.",
      foto: "", destacado: false
    },
    {
      id: "chullo",
      nombre: "Chullo con orejeras",
      categoria: "artesania", productor: "awana-ccatca",
      precio: 35, unidad: "unidad",
      descripcion: "Gorro tejido a palitos con lana de oveja y alpaca. Tallas para niños y adultos.",
      disponible: "Todo el año.",
      foto: "", destacado: false
    },
    {
      id: "maiz-blanco",
      nombre: "Maíz blanco para mote",
      categoria: "granos", productor: "granos-vilcanota",
      precio: 6, unidad: "kilo",
      descripcion: "Maíz de grano grande, seleccionado a mano. Sale suave y harinoso al cocinar.",
      disponible: "De junio a diciembre.",
      foto: "", destacado: true
    },
    {
      id: "quinua",
      nombre: "Quinua blanca lavada",
      categoria: "granos", productor: "granos-vilcanota",
      precio: 12, unidad: "kilo",
      descripcion: "Quinua lista para cocinar, ya lavada y sin amargor.",
      disponible: "Todo el año.",
      foto: "", destacado: false
    },
    {
      id: "papa-nativa",
      nombre: "Papas nativas surtidas",
      categoria: "granos", productor: "granos-vilcanota",
      precio: 4, unidad: "kilo",
      descripcion: "Mezcla de papas nativas de colores: peruanita, huayro y qompis. Para sancochar o hacer al horno.",
      disponible: "De abril a agosto.",
      foto: "", destacado: false
    },
    {
      id: "cuy-beneficiado",
      nombre: "Cuy pelado listo para cocinar",
      categoria: "crianza", productor: "cuyes-huaro",
      precio: 30, unidad: "unidad",
      descripcion: "Cuy de buen tamaño, limpio y listo para la olla o el horno.",
      disponible: "Pedidos con dos días de anticipación.",
      foto: "", destacado: true
    },
    {
      id: "cuy-reproductor",
      nombre: "Cuy reproductor",
      categoria: "crianza", productor: "cuyes-huaro",
      precio: 45, unidad: "unidad",
      descripcion: "Machos y hembras de buena raza para empezar o mejorar tu crianza.",
      disponible: "Consultar disponibilidad.",
      foto: "", destacado: false
    },
    {
      id: "canasta-verduras",
      nombre: "Canasta de verduras de la semana",
      categoria: "hortalizas", productor: "huerta-andahuaylillas",
      precio: 20, unidad: "canasta",
      descripcion: "Lechuga, zanahoria, acelga, cebolla china, betarraga y hierbas. Varía según la cosecha.",
      disponible: "Entregas los sábados.",
      foto: "", destacado: true
    },
    {
      id: "lechuga",
      nombre: "Lechuga fresca",
      categoria: "hortalizas", productor: "huerta-andahuaylillas",
      precio: 2, unidad: "unidad",
      descripcion: "Lechuga crespa cultivada sin químicos, cosechada el mismo día.",
      disponible: "Todo el año.",
      foto: "", destacado: false
    },
    {
      id: "miel-abeja",
      nombre: "Miel de abeja pura",
      categoria: "miel", productor: "miel-marcapata",
      precio: 30, unidad: "frasco de 500 gramos",
      descripcion: "Miel de flores silvestres, sin azúcar añadida. Buena para endulzar mates y para la garganta.",
      disponible: "Todo el año, hasta agotar cosecha.",
      foto: "", destacado: true
    },
    {
      id: "polen",
      nombre: "Polen de abeja",
      categoria: "miel", productor: "miel-marcapata",
      precio: 25, unidad: "frasco de 200 gramos",
      descripcion: "Polen seco en granitos. Se toma una cucharadita con jugo o yogur.",
      disponible: "Bajo pedido.",
      foto: "", destacado: false
    }
  ]
};
