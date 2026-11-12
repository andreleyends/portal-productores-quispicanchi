/* Portal "Productores de Quispicanchi" — lógica de la página.
   Los datos del catálogo están en js/datos.js */
(function () {
  "use strict";

  var D = window.PORTAL;
  var main = document.getElementById("contenido");
  var flotante = document.getElementById("mensaje-flotante");
  var vistasMostradas = 0;

  /* ---------- Utilidades ---------- */

  // Crea elementos sin usar innerHTML: todo texto entra como texto, nunca como HTML.
  function h(tag, attrs) {
    var el = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v == null || v === false) return;
        if (k === "class") el.className = v;
        else if (k.indexOf("on") === 0) el.addEventListener(k.slice(2), v);
        else if (v === true) el.setAttribute(k, "");
        else el.setAttribute(k, v);
      });
    }
    for (var i = 2; i < arguments.length; i++) agregar(el, arguments[i]);
    return el;
  }
  function agregar(el, hijo) {
    if (hijo == null || hijo === false) return;
    if (Array.isArray(hijo)) { hijo.forEach(function (x) { agregar(el, x); }); return; }
    el.appendChild(hijo.nodeType ? hijo : document.createTextNode(String(hijo)));
  }

  // Íconos fijos del sitio (no contienen datos de usuarios).
  var ICONOS = {
    whatsapp: '<path d="M12 2a10 10 0 0 0-8.600 15.100L2 22l5-1.300A10 10 0 1 0 12 2zm5.300 14.100c-.200.600-1.300 1.200-1.800 1.200-.500.100-1.100.100-1.700-.100-1.500-.500-3.400-1.500-5.100-4.100-1.200-1.800-1.300-3.200-.400-4.300.300-.400.700-.500 1-.500h.600c.200 0 .500 0 .700.600l.900 2.100c.100.200.100.400 0 .600l-.800 1c.700 1.300 1.800 2.300 3.200 2.900l.900-1.100c.200-.200.400-.300.700-.200l2.100 1c.300.200.400.300.400.500 0 .100 0 .300-.700.400z"/>',
    buscar: '<path d="M10 3a7 7 0 1 0 4.300 12.500l4.600 4.600 1.400-1.400-4.600-4.600A7 7 0 0 0 10 3zm0 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10z"/>',
    volver: '<path d="M11 5 4 12l7 7 1.400-1.400L7.800 13H20v-2H7.800l4.600-4.600z"/>',
    compartir: '<path d="M18 16a3 3 0 0 0-2.200 1L8.900 13a3 3 0 0 0 0-2l6.900-4A3 3 0 1 0 15 5c0 .300 0 .600.100.900L8.200 9.900a3 3 0 1 0 0 4.200l6.900 4A3 3 0 1 0 18 16z"/>',
    lugar: '<path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.500a2.500 2.500 0 1 1 0-5 2.500 2.500 0 0 1 0 5z"/>',
    correo: '<path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm9 8 8-6H4z"/>',
    copiar: '<path d="M8 3h11a1 1 0 0 1 1 1v13h-2V5H8zM5 7h10a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z"/>',
    flecha: '<path d="m13 5 7 7-7 7-1.400-1.400 4.600-4.600H4v-2h12.200l-4.600-4.600z"/>'
  };
  function icono(nombre) {
    var s = document.createElement("span");
    s.className = "icono";
    s.setAttribute("aria-hidden", "true");
    s.innerHTML = '<svg viewBox="0 0 24 24" focusable="false">' + ICONOS[nombre] + "</svg>";
    return s;
  }

  function normalizar(t) {
    return String(t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  }
  function buscarPorId(lista, id) {
    for (var i = 0; i < lista.length; i++) if (lista[i].id === id) return lista[i];
    return null;
  }
  function categoriaDe(p) { return buscarPorId(D.categorias, p.categoria) || { nombre: "", imagen: "" }; }
  function productorDe(p) { return buscarPorId(D.productores, p.productor); }
  function productosDe(pr) { return D.productos.filter(function (p) { return p.productor === pr.id; }); }

  function textoPrecio(p) {
    if (!p.precio) return "Consultar precio";
    var n = Number(p.precio);
    return "S/ " + (n % 1 === 0 ? n : n.toFixed(2));
  }
  function iniciales(nombre) {
    return nombre.split(/\s+/).filter(function (w) { return w.length > 2; }).slice(0, 2)
      .map(function (w) { return w.charAt(0).toUpperCase(); }).join("");
  }

  function enlaceWhatsApp(numero, texto) {
    var n = String(numero || "").replace(/\D/g, "");
    if (n.length === 9) n = "51" + n;
    return "https://wa.me/" + n + "?text=" + encodeURIComponent(texto);
  }

  var temporizador;
  function avisar(texto) {
    flotante.textContent = texto;
    flotante.classList.add("visible");
    clearTimeout(temporizador);
    temporizador = setTimeout(function () { flotante.classList.remove("visible"); }, 4000);
  }

  function copiar(texto, mensajeOk) {
    function respaldo() {
      var t = h("textarea", { class: "oculto", readonly: true });
      t.value = texto;
      document.body.appendChild(t);
      t.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) { /* sin permiso */ }
      t.remove();
      avisar(ok ? mensajeOk : "No se pudo copiar. Mantén presionado el texto para copiarlo.");
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texto).then(function () { avisar(mensajeOk); }, respaldo);
    } else respaldo();
  }

  /* ---------- Piezas que se repiten ---------- */

  function imagenProducto(p, clase) {
    var cat = categoriaDe(p);
    return h("img", {
      class: clase,
      src: p.foto || cat.imagen,
      alt: p.foto ? "Foto de " + p.nombre : "",
      loading: "lazy", width: "400", height: "300"
    });
  }

  function etiquetaEjemplo(pr) {
    return pr && pr.ejemplo ? h("span", { class: "etiqueta etiqueta--ejemplo" }, "Ejemplo") : null;
  }

  function tarjetaProducto(p) {
    var pr = productorDe(p);
    return h("li", { class: "tarjeta" },
      h("div", { class: "tarjeta__imagen" }, imagenProducto(p), etiquetaEjemplo(pr)),
      h("div", { class: "tarjeta__cuerpo" },
        h("p", { class: "tarjeta__categoria" }, categoriaDe(p).nombre),
        h("h3", { class: "tarjeta__titulo" },
          h("a", { href: "#/producto/" + p.id, class: "enlace-tarjeta" }, p.nombre)),
        h("p", { class: "precio" }, textoPrecio(p),
          p.precio ? h("span", { class: "precio__unidad" }, " por " + p.unidad) : null),
        pr ? h("p", { class: "tarjeta__productor" }, pr.nombre) : null,
        pr ? h("p", { class: "tarjeta__lugar" }, icono("lugar"), pr.distrito) : null,
        h("span", { class: "tarjeta__ver", "aria-hidden": "true" }, "Ver producto ", icono("flecha"))
      )
    );
  }

  function insignia(pr, grande) {
    if (pr.logo) {
      return h("img", { class: "insignia" + (grande ? " insignia--grande" : ""), src: pr.logo, alt: "Logo de " + pr.nombre });
    }
    return h("span", { class: "insignia" + (grande ? " insignia--grande" : ""), "aria-hidden": "true" }, iniciales(pr.nombre));
  }

  function tarjetaProductor(pr) {
    var n = productosDe(pr).length;
    return h("li", { class: "tarjeta tarjeta--productor" },
      h("div", { class: "tarjeta__cuerpo" },
        h("div", { class: "productor-cabeza" },
          insignia(pr),
          h("div", null,
            h("h3", { class: "tarjeta__titulo" },
              h("a", { href: "#/productor/" + pr.id, class: "enlace-tarjeta" }, pr.nombre)),
            h("p", { class: "tarjeta__categoria" }, pr.tipo))),
        h("p", null, pr.resumen),
        h("p", { class: "tarjeta__lugar" }, icono("lugar"), pr.distrito, " ", etiquetaEjemplo(pr)),
        h("span", { class: "tarjeta__ver", "aria-hidden": "true" },
          "Ver sus " + n + (n === 1 ? " producto " : " productos "), icono("flecha"))
      )
    );
  }

  function botonVolver(destino, texto) {
    return h("a", {
      class: "volver", href: destino,
      onclick: function (e) {
        if (vistasMostradas > 1) { e.preventDefault(); history.back(); }
      }
    }, icono("volver"), texto || "Volver");
  }

  function botonWhatsApp(pr, mensaje, texto) {
    return h("a", {
      class: "boton boton--whatsapp boton--ancho",
      href: enlaceWhatsApp(pr.whatsapp, mensaje),
      target: "_blank", rel: "noopener"
    }, icono("whatsapp"), texto, h("span", { class: "oculto" }, " (se abre WhatsApp)"));
  }

  function notaSinNumero(pr) {
    if (pr.whatsapp) return null;
    return h("p", { class: "nota" },
      "Este productor es un ejemplo y no tiene número. WhatsApp te pedirá elegir a quién enviar el mensaje.");
  }

  /* ---------- Vistas ---------- */

  function vistaInicio() {
    var destacados = D.productos.filter(function (p) { return p.destacado; });

    return [
      h("section", { class: "portada" },
        h("div", { class: "contenedor portada__fila" },
          h("div", { class: "portada__texto" },
            h("p", { class: "sobretitulo" }, "Provincia de Quispicanchi · Cusco"),
            h("h1", { tabindex: "-1" }, "Productos de nuestra tierra, directo de quien los produce"),
            h("p", { class: "portada__bajada" },
              "Mira lo que elaboran las familias y asociaciones de Quispicanchi, conoce a cada productor y haz tu pedido por WhatsApp."),
            h("form", {
              class: "buscador", role: "search",
              onsubmit: function (e) {
                e.preventDefault();
                var q = e.target.elements.q.value.trim();
                location.hash = "#/catalogo" + (q ? "?q=" + encodeURIComponent(q) : "");
              }
            },
              h("label", { for: "buscar-inicio" }, "¿Qué producto buscas?"),
              h("div", { class: "buscador__fila" },
                h("input", { id: "buscar-inicio", name: "q", type: "search", placeholder: "Ej.: queso, miel", autocomplete: "off", enterkeyhint: "search" }),
                h("button", { class: "boton boton--principal", type: "submit" }, icono("buscar"), "Buscar"))),
            h("div", { class: "botonera" },
              h("a", { class: "boton boton--claro", href: "#/catalogo" }, "Ver todo el catálogo"),
              h("a", { class: "boton boton--borde-claro", href: "#/productores" }, "Conocer a los productores"))),
          h("img", { class: "portada__dibujo", src: "img/portada.svg", alt: "", width: "520", height: "400" })
        )
      ),

      h("section", { class: "seccion contenedor", "aria-labelledby": "t-categorias" },
        h("h2", { id: "t-categorias" }, "Busca por tipo de producto"),
        h("ul", { class: "categorias" }, D.categorias.map(function (c) {
          var n = D.productos.filter(function (p) { return p.categoria === c.id; }).length;
          return h("li", null,
            h("a", { class: "categoria", href: "#/catalogo?cat=" + c.id },
              h("img", { src: c.imagen, alt: "", loading: "lazy", width: "400", height: "300" }),
              h("span", { class: "categoria__nombre" }, c.nombre),
              h("span", { class: "categoria__cuenta" }, n + (n === 1 ? " producto" : " productos"))));
        }))
      ),

      h("section", { class: "seccion seccion--crema", "aria-labelledby": "t-pasos" },
        h("div", { class: "contenedor" },
          h("h2", { id: "t-pasos" }, "Pedir es muy fácil"),
          h("ol", { class: "pasos" },
            h("li", null, h("span", { class: "pasos__numero", "aria-hidden": "true" }, "1"),
              h("h3", null, "Elige un producto"), h("p", null, "Mira el catálogo o usa el buscador.")),
            h("li", null, h("span", { class: "pasos__numero", "aria-hidden": "true" }, "2"),
              h("h3", null, "Conoce al productor"), h("p", null, "Lee quién lo hace, dónde y cómo.")),
            h("li", null, h("span", { class: "pasos__numero", "aria-hidden": "true" }, "3"),
              h("h3", null, "Pide por WhatsApp"), h("p", null, "Toca el botón verde y el mensaje ya sale escrito."))))
      ),

      h("section", { class: "seccion contenedor", "aria-labelledby": "t-destacados" },
        h("div", { class: "titulo-fila" },
          h("h2", { id: "t-destacados" }, "Productos destacados"),
          h("a", { class: "enlace-flecha", href: "#/catalogo" }, "Ver todos", icono("flecha"))),
        h("ul", { class: "rejilla" }, destacados.map(tarjetaProducto))
      ),

      h("section", { class: "seccion contenedor", "aria-labelledby": "t-llamado" },
        h("div", { class: "llamado" },
          h("div", null,
            h("h2", { id: "t-llamado" }, "¿Eres productor de Quispicanchi?"),
            h("p", null, "Muestra tus productos y haz conocida tu marca. Aparecer en el catálogo es gratis.")),
          h("a", { class: "boton boton--claro", href: "#/inscripcion" }, "Quiero aparecer en el catálogo"))
      )
    ];
  }

  function vistaCatalogo(params) {
    var estado = {
      q: params.get("q") || "",
      cat: buscarPorId(D.categorias, params.get("cat")) ? params.get("cat") : "",
      dist: D.distritos.indexOf(params.get("dist")) >= 0 ? params.get("dist") : ""
    };

    var lista = h("ul", { class: "rejilla" });
    var cuenta = h("p", { class: "resultados", role: "status", "aria-live": "polite" });
    var vacio = h("div", { class: "vacio", hidden: true },
      h("h2", null, "No encontramos productos"),
      h("p", null, "Prueba con otra palabra o quita los filtros."),
      h("button", { class: "boton boton--principal", type: "button", onclick: limpiar }, "Ver todos los productos"));

    var campoQ = h("input", { id: "f-q", type: "search", value: estado.q, placeholder: "Por ejemplo: queso", autocomplete: "off", enterkeyhint: "search" });
    var campoCat = h("select", { id: "f-cat" },
      h("option", { value: "" }, "Todos los tipos"),
      D.categorias.map(function (c) { return h("option", { value: c.id, selected: c.id === estado.cat }, c.nombre); }));
    var distritosConProductos = D.distritos.filter(function (d) {
      return D.productores.some(function (pr) { return pr.distrito === d && productosDe(pr).length; });
    });
    var campoDist = h("select", { id: "f-dist" },
      h("option", { value: "" }, "Todos los distritos"),
      distritosConProductos.map(function (d) { return h("option", { value: d, selected: d === estado.dist }, d); }));
    var botonLimpiar = h("button", { class: "boton boton--borde", type: "button", onclick: limpiar }, "Quitar filtros");

    function limpiar() {
      campoQ.value = ""; campoCat.value = ""; campoDist.value = "";
      actualizar();
      campoQ.focus();
    }

    function actualizar() {
      estado.q = campoQ.value.trim(); estado.cat = campoCat.value; estado.dist = campoDist.value;
      var q = normalizar(estado.q);
      var res = D.productos.filter(function (p) {
        var pr = productorDe(p) || {};
        if (estado.cat && p.categoria !== estado.cat) return false;
        if (estado.dist && pr.distrito !== estado.dist) return false;
        if (!q) return true;
        var texto = normalizar([p.nombre, p.descripcion, categoriaDe(p).nombre, pr.nombre, pr.distrito, pr.lugar].join(" "));
        return q.split(/\s+/).every(function (palabra) { return texto.indexOf(palabra) >= 0; });
      });

      lista.replaceChildren.apply(lista, res.map(tarjetaProducto));
      vacio.hidden = res.length > 0;
      cuenta.textContent = res.length === 0 ? "" :
        res.length === 1 ? "Se muestra 1 producto" : "Se muestran " + res.length + " productos";
      botonLimpiar.hidden = !(estado.q || estado.cat || estado.dist);

      // Guarda los filtros en la dirección para poder compartirla o volver a ella.
      var partes = [];
      if (estado.q) partes.push("q=" + encodeURIComponent(estado.q));
      if (estado.cat) partes.push("cat=" + encodeURIComponent(estado.cat));
      if (estado.dist) partes.push("dist=" + encodeURIComponent(estado.dist));
      var nuevo = "#/catalogo" + (partes.length ? "?" + partes.join("&") : "");
      if (location.hash !== nuevo) history.replaceState(null, "", nuevo);
    }

    campoQ.addEventListener("input", actualizar);
    campoCat.addEventListener("change", actualizar);
    campoDist.addEventListener("change", actualizar);
    actualizar();

    return h("div", { class: "contenedor seccion" },
      h("h1", { tabindex: "-1" }, "Catálogo de productos"),
      h("p", { class: "bajada" }, "Toca un producto para ver los detalles y hacer tu pedido."),
      h("form", { class: "filtros", role: "search", "aria-label": "Buscar y filtrar productos", onsubmit: function (e) { e.preventDefault(); campoQ.blur(); } },
        h("div", { class: "campo" }, h("label", { for: "f-q" }, "Buscar"), campoQ),
        h("div", { class: "campo" }, h("label", { for: "f-cat" }, "Tipo de producto"), campoCat),
        h("div", { class: "campo" }, h("label", { for: "f-dist" }, "Distrito"), campoDist),
        botonLimpiar),
      cuenta, lista, vacio);
  }

  function vistaProductores() {
    return h("div", { class: "contenedor seccion" },
      h("h1", { tabindex: "-1" }, "Nuestros productores"),
      h("p", { class: "bajada" }, "Familias, asociaciones y emprendimientos de Quispicanchi. Toca un nombre para conocer su historia y sus productos."),
      h("ul", { class: "rejilla rejilla--ancha" }, D.productores.map(tarjetaProductor)));
  }

  function vistaProductor(id) {
    var pr = buscarPorId(D.productores, id);
    if (!pr) return vistaNoEncontrada();
    var productos = productosDe(pr);
    var mensaje = "Hola, vi a " + pr.nombre + " en el catálogo Productores de Quispicanchi y quisiera más información.";

    return h("div", { class: "contenedor seccion" },
      botonVolver("#/productores", "Volver a productores"),
      h("div", { class: "ficha-productor" },
        h("div", { class: "ficha-productor__cabeza" },
          insignia(pr, true),
          h("div", null,
            h("p", { class: "sobretitulo sobretitulo--oscuro" }, pr.tipo, " ", etiquetaEjemplo(pr)),
            h("h1", { tabindex: "-1" }, pr.nombre),
            h("p", { class: "tarjeta__lugar" }, icono("lugar"), (pr.lugar ? pr.lugar + ", " : "") + pr.distrito + ", Quispicanchi"))),
        h("p", { class: "ficha-productor__historia" }, pr.historia),
        h("div", { class: "ficha-productor__accion" },
          botonWhatsApp(pr, mensaje, "Escribir por WhatsApp"),
          notaSinNumero(pr))),
      h("h2", null, "Productos de " + pr.nombre),
      productos.length
        ? h("ul", { class: "rejilla" }, productos.map(tarjetaProducto))
        : h("p", null, "Este productor todavía no tiene productos publicados."));
  }

  function vistaProducto(id) {
    var p = buscarPorId(D.productos, id);
    var pr = p && productorDe(p);
    if (!p || !pr) return vistaNoEncontrada();
    var mensaje = "Hola, vi su producto \"" + p.nombre + "\" (" + textoPrecio(p) + (p.precio ? " por " + p.unidad : "") +
      ") en el catálogo Productores de Quispicanchi. Quisiera hacer un pedido.";

    function compartir() {
      var datos = { title: p.nombre + " · " + pr.nombre, text: p.nombre + ", de " + pr.nombre + " (" + pr.distrito + ")", url: location.href };
      if (navigator.share) navigator.share(datos).catch(function () { /* la persona canceló */ });
      else copiar(location.href, "Enlace copiado. Ya puedes pegarlo donde quieras.");
    }

    return h("div", { class: "contenedor seccion" },
      botonVolver("#/catalogo", "Volver al catálogo"),
      h("article", { class: "ficha" },
        h("div", { class: "ficha__imagen" }, imagenProducto(p), etiquetaEjemplo(pr)),
        h("div", { class: "ficha__datos" },
          h("p", { class: "tarjeta__categoria" }, categoriaDe(p).nombre),
          h("h1", { tabindex: "-1" }, p.nombre),
          h("p", { class: "precio precio--grande" }, textoPrecio(p),
            p.precio ? h("span", { class: "precio__unidad" }, " por " + p.unidad) : null),
          h("p", { class: "nota" }, "Precio referencial. Se confirma con el productor."),
          h("p", { class: "ficha__descripcion" }, p.descripcion),
          h("dl", { class: "detalles" },
            p.disponible ? [h("dt", null, "¿Cuándo hay?"), h("dd", null, p.disponible)] : null,
            h("dt", null, "¿De dónde viene?"),
            h("dd", null, (pr.lugar ? pr.lugar + ", " : "") + pr.distrito + ", Quispicanchi")),
          botonWhatsApp(pr, mensaje, "Pedir por WhatsApp"),
          notaSinNumero(pr),
          h("button", { class: "boton boton--borde boton--ancho", type: "button", onclick: compartir }, icono("compartir"), "Compartir este producto"))),
      h("section", { class: "caja-productor", "aria-labelledby": "t-quien" },
        h("h2", { id: "t-quien" }, "¿Quién lo produce?"),
        h("div", { class: "productor-cabeza" },
          insignia(pr),
          h("div", null,
            h("p", { class: "caja-productor__nombre" }, pr.nombre),
            h("p", { class: "tarjeta__categoria" }, pr.tipo))),
        h("p", null, pr.resumen),
        h("a", { class: "enlace-flecha", href: "#/productor/" + pr.id }, "Conocer a " + pr.nombre, icono("flecha"))));
  }

  function vistaInscripcion() {
    var campos = [
      { id: "nombre", etiqueta: "Tu nombre y apellido", tipo: "text", auto: "name", requerido: true,
        validar: function (v) { return v.length >= 3 ? "" : "Escribe tu nombre y apellido."; } },
      { id: "marca", etiqueta: "Nombre de tu marca o asociación", ayuda: "Si no tienes, déjalo en blanco.", tipo: "text", auto: "organization",
        validar: function () { return ""; } },
      { id: "distrito", etiqueta: "¿En qué distrito produces?", tipo: "select", requerido: true,
        validar: function (v) { return v ? "" : "Elige tu distrito de la lista."; } },
      { id: "produce", etiqueta: "¿Qué produces?", ayuda: "Por ejemplo: quesos, tejidos, cuyes, papa nativa.", tipo: "textarea", requerido: true,
        validar: function (v) { return v.length >= 3 ? "" : "Cuéntanos qué produces."; } },
      { id: "celular", etiqueta: "Tu número de celular", ayuda: "9 números, sin espacios. Por ejemplo: 987654321", tipo: "tel", auto: "tel-national", requerido: true,
        validar: function (v) { return /^9\d{8}$/.test(v.replace(/[\s-]/g, "")) ? "" : "El celular debe tener 9 números y empezar con 9."; } }
    ];

    var controles = {};
    var errores = {};

    var filas = campos.map(function (c) {
      var describe = [c.ayuda ? "ayuda-" + c.id : "", "error-" + c.id].join(" ").trim();
      var comunes = { id: "i-" + c.id, name: c.id, "aria-describedby": describe, "aria-required": c.requerido ? "true" : null };
      var control;
      if (c.tipo === "select") {
        control = h("select", comunes, h("option", { value: "" }, "Elige un distrito"),
          D.distritos.map(function (d) { return h("option", { value: d }, d); }),
          h("option", { value: "Otro lugar" }, "Otro lugar"));
      } else if (c.tipo === "textarea") {
        comunes.rows = "3";
        control = h("textarea", comunes);
      } else {
        comunes.type = c.tipo; comunes.autocomplete = c.auto;
        if (c.tipo === "tel") { comunes.inputmode = "numeric"; comunes.maxlength = "11"; }
        control = h("input", comunes);
      }
      controles[c.id] = control;
      errores[c.id] = h("p", { class: "campo__error", id: "error-" + c.id, hidden: true });
      control.addEventListener("blur", function () { if (control.getAttribute("aria-invalid")) revisar(c); });
      return h("div", { class: "campo" },
        h("label", { for: "i-" + c.id }, c.etiqueta, c.requerido ? null : h("span", { class: "campo__opcional" }, " (opcional)")),
        c.ayuda ? h("p", { class: "campo__ayuda", id: "ayuda-" + c.id }, c.ayuda) : null,
        control, errores[c.id]);
    });

    function revisar(c) {
      var msg = c.validar(controles[c.id].value.trim());
      errores[c.id].textContent = msg;
      errores[c.id].hidden = !msg;
      if (msg) controles[c.id].setAttribute("aria-invalid", "true");
      else controles[c.id].removeAttribute("aria-invalid");
      return !msg;
    }

    var resumenError = h("p", { class: "aviso-error", role: "alert", hidden: true });
    var formulario = h("form", { class: "formulario", novalidate: true, onsubmit: enviar },
      h("p", { class: "nota" }, "Solo te pedimos 5 datos. No se guardan en esta página: tú mismo envías el mensaje."),
      filas, resumenError,
      h("button", { class: "boton boton--principal boton--ancho", type: "submit" }, "Continuar"));

    var listo = h("section", { class: "listo", hidden: true, "aria-labelledby": "t-listo" });

    function enviar(e) {
      e.preventDefault();
      var malos = campos.filter(function (c) { return !revisar(c); });
      if (malos.length) {
        resumenError.textContent = malos.length === 1 ? "Falta corregir 1 dato. Revisa el campo marcado en rojo."
          : "Falta corregir " + malos.length + " datos. Revisa los campos marcados en rojo.";
        resumenError.hidden = false;
        controles[malos[0].id].focus();
        return;
      }
      resumenError.hidden = true;
      var v = {};
      campos.forEach(function (c) { v[c.id] = controles[c.id].value.trim(); });
      var mensaje = [
        "Hola, quiero aparecer en el catálogo Productores de Quispicanchi.",
        "",
        "Nombre: " + v.nombre,
        "Marca o asociación: " + (v.marca || "(no tengo)"),
        "Distrito: " + v.distrito,
        "Qué produzco: " + v.produce,
        "Celular: " + v.celular.replace(/[\s-]/g, "")
      ].join("\n");

      var titulo = h("h2", { id: "t-listo", tabindex: "-1" }, "¡Tu mensaje está listo!");
      listo.replaceChildren(
        titulo,
        h("p", null, "Falta un solo paso: enviarlo. Elige cómo quieres mandarlo."),
        h("pre", { class: "listo__mensaje" }, mensaje),
        h("div", { class: "botonera botonera--columna" },
          h("a", { class: "boton boton--whatsapp boton--ancho", target: "_blank", rel: "noopener",
            href: enlaceWhatsApp(D.config.whatsappInscripciones, mensaje) }, icono("whatsapp"), "Enviar por WhatsApp"),
          h("a", { class: "boton boton--borde boton--ancho",
            href: "mailto:" + encodeURIComponent(D.config.correoInscripciones || "") +
              "?subject=" + encodeURIComponent("Quiero aparecer en el catálogo") + "&body=" + encodeURIComponent(mensaje) },
            icono("correo"), "Enviar por correo"),
          h("button", { class: "boton boton--borde boton--ancho", type: "button",
            onclick: function () { copiar(mensaje, "Mensaje copiado."); } }, icono("copiar"), "Copiar el mensaje"),
          h("button", { class: "boton boton--texto", type: "button",
            onclick: function () { listo.hidden = true; formulario.hidden = false; controles.nombre.focus(); } }, "Corregir mis datos")),
        D.config.whatsappInscripciones ? null :
          h("p", { class: "nota" }, "WhatsApp te pedirá elegir a quién enviar el mensaje.")
      );
      formulario.hidden = true;
      listo.hidden = false;
      titulo.focus();
    }

    return h("div", { class: "contenedor seccion seccion--angosta" },
      h("h1", { tabindex: "-1" }, "Quiero aparecer en el catálogo"),
      h("p", { class: "bajada" }, "Si produces en Quispicanchi, muestra aquí tus productos y haz conocida tu marca. Es gratis."),
      formulario, listo);
  }

  function vistaNoEncontrada() {
    return h("div", { class: "contenedor seccion vacio" },
      h("h1", { tabindex: "-1" }, "No encontramos esta página"),
      h("p", null, "Puede que el producto ya no esté en el catálogo."),
      h("a", { class: "boton boton--principal", href: "#/catalogo" }, "Ir al catálogo"));
  }

  /* ---------- Navegación entre vistas ---------- */

  function leerRuta() {
    var crudo = location.hash.replace(/^#\/?/, "");
    var corte = crudo.indexOf("?");
    var camino = (corte >= 0 ? crudo.slice(0, corte) : crudo).split("/").filter(Boolean).map(decodeURIComponent);
    return { camino: camino, params: new URLSearchParams(corte >= 0 ? crudo.slice(corte + 1) : "") };
  }

  function mostrar() {
    var ruta = leerRuta();
    var seccion = ruta.camino[0] || "inicio";
    var vista, titulo, menu = seccion;

    if (seccion === "inicio") { vista = vistaInicio(); titulo = ""; }
    else if (seccion === "catalogo") { vista = vistaCatalogo(ruta.params); titulo = "Catálogo"; }
    else if (seccion === "productores") { vista = vistaProductores(); titulo = "Productores"; }
    else if (seccion === "productor") {
      var pr = buscarPorId(D.productores, ruta.camino[1]);
      vista = vistaProductor(ruta.camino[1]); titulo = pr ? pr.nombre : "No encontrado"; menu = "productores";
    } else if (seccion === "producto") {
      var p = buscarPorId(D.productos, ruta.camino[1]);
      vista = vistaProducto(ruta.camino[1]); titulo = p ? p.nombre : "No encontrado"; menu = "catalogo";
    } else if (seccion === "inscripcion") { vista = vistaInscripcion(); titulo = "Quiero aparecer"; }
    else if (seccion === "contenido") { return; } // enlace "Saltar al contenido"
    else { vista = vistaNoEncontrada(); titulo = "No encontrado"; menu = ""; }

    main.replaceChildren();
    agregar(main, vista);
    document.title = (titulo ? titulo + " · " : "") + D.config.nombreSitio;

    document.querySelectorAll(".menu a").forEach(function (a) {
      if (a.getAttribute("data-seccion") === menu) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });

    vistasMostradas++;
    window.scrollTo(0, 0);
    if (vistasMostradas > 1) {
      var h1 = main.querySelector("h1");
      if (h1) h1.focus({ preventScroll: true });
    }
  }

  /* ---------- Tamaño de letra ---------- */

  var botonLetra = document.getElementById("boton-letra");
  var textoLetra = document.getElementById("boton-letra-texto");
  function ponerLetra(grande) {
    document.documentElement.classList.toggle("letra-grande", grande);
    botonLetra.setAttribute("aria-pressed", grande ? "true" : "false");
    textoLetra.textContent = grande ? "Letra normal" : "Letra grande";
    botonLetra.querySelector(".boton-letra__a").textContent = grande ? "A−" : "A+";
  }
  botonLetra.addEventListener("click", function () {
    var grande = !document.documentElement.classList.contains("letra-grande");
    ponerLetra(grande);
    try { localStorage.setItem("letraGrande", grande ? "1" : "0"); } catch (e) { /* sin almacenamiento */ }
  });
  try { if (localStorage.getItem("letraGrande") === "1") ponerLetra(true); } catch (e) { /* sin almacenamiento */ }

  /* ---------- Inicio ---------- */

  document.querySelector(".saltar").addEventListener("click", function (e) {
    e.preventDefault();
    main.focus();
    main.scrollIntoView();
  });

  document.getElementById("aviso-demo").hidden = !D.config.esDemo;
  window.addEventListener("hashchange", mostrar);
  mostrar();
})();
