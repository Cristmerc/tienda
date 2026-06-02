// Base de datos de productos simulada
const baseProductos = [
  { id: 1, nombre: "Sudadera Oversize Black", categoria: "ropa", precio: 45.00, precioOriginal: 60.00, emoji: "🧥" },
  { id: 2, nombre: "Camiseta Graphic Acid", categoria: "ropa", precio: 25.00, precioOriginal: null, emoji: "👕" },
  { id: 3, nombre: "Pantallón Cargo Tech", categoria: "ropa", precio: 55.00, precioOriginal: 65.00, emoji: "👖" },
  { id: 4, nombre: "Zapatillas Drip Runner v1", categoria: "calzado", precio: 110.00, precioOriginal: 140.00, emoji: "👟" },
  { id: 5, nombre: "Gorra Dad Hat Street", categoria: "accesorios", precio: 20.00, precioOriginal: null, emoji: "🧢" },
  { id: 6, nombre: "Cadena Chain Link Silver", categoria: "accesorios", precio: 15.00, precioOriginal: 25.00, emoji: "⛓️" }
];


let carritoItems = [];

const contenedorProductos = document.getElementById("contenedor-productos");
const listaCarrito = document.getElementById("lista-carrito");
const contadorCarrito = document.getElementById("contador-carrito");
const totalPrecio = document.getElementById("total-precio");
const panelCarrito = document.getElementById("carrito");
const fondoCarrito = document.getElementById("fondo-carrito");
const toast = document.getElementById("toast");

function inicializarTienda() {
  renderizarProductos(baseProductos);
  configurarEventosFiltros();
  configurarEventosCarrito();
  actualizarVistaCarrito();
}

function renderizarProductos(productosAMostrar) {
  contenedorProductos.innerHTML = "";
  
  if(productosAMostrar.length === 0) {
    contenedorProductos.innerHTML = "<p>No hay artículos disponibles.</p>";
    return;
  }

  productosAMostrar.forEach(prod => {
    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta";
    
    let descuentoHTML = prod.precioOriginal ? `<span class="precio-tachado">$${prod.precioOriginal.toFixed(2)}</span>` : "";

    tarjeta.innerHTML = `
      <div class="tarjeta-imagen">${prod.emoji}</div>
      <div class="tarjeta-info">
        <div class="tarjeta-categoria">${prod.categoria}</div>
        <div class="tarjeta-nombre">${prod.nombre}</div>
        <div class="tarjeta-precio">$${prod.precio.toFixed(2)} ${descuentoHTML}</div>
        <button class="btn-añadir" data-id="${prod.id}">Añadir al carrito</button>
      </div>
    `;
    contenedorProductos.appendChild(tarjeta);
  });

  const botonesAñadir = contenedorProductos.querySelectorAll(".btn-añadir");
  botonesAñadir.forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.getAttribute("data-id"));
      añadirAlCarrito(id);
    });
  });
}

function configurarEventosFiltros() {
  const botonesFiltro = document.querySelectorAll(".filtros button");
  botonesFiltro.forEach(btn => {
    btn.addEventListener("click", () => {
      botonesFiltro.forEach(b => b.classList.remove("activo"));
      btn.classList.add("activo");
      
      const categoria = btn.getAttribute("data-categoria");
      if (categoria === "todos") {
        renderizarProductos(baseProductos);
      } else {
        const filtrados = baseProductos.filter(p => p.categoria === categoria);
        renderizarProductos(filtrados);
      }
    });
  });
}

function configurarEventosCarrito() {
  document.getElementById("btn-abrir-carrito").addEventListener("click", abrirCarrito);
  document.getElementById("btn-cerrar-carrito").addEventListener("click", cerrarCarrito);
  fondoCarrito.addEventListener("click", cerrarCarrito);
  
  document.getElementById("btn-finalizar-compra").addEventListener("click", () => {
    if(carritoItems.length === 0) {
      mostrarNotificacion("Tu carrito está vacío.");
      return;
    }
    mostrarNotificacion("¡Compra realizada con éxito! 🚀");
    carritoItems = [];
    actualizarVistaCarrito();
    cerrarCarrito();
  });
}

function abrirCarrito() {
  panelCarrito.classList.add("abierto");
  fondoCarrito.classList.add("visible");
}

function cerrarCarrito() {
  panelCarrito.classList.remove("abierto");
  fondoCarrito.classList.remove("visible");
}

function añadirAlCarrito(id) {
  const itemExistente = carritoItems.find(item => item.id === id);
  if(itemExistente) {
    itemExistente.cantidad++;
  } else {
    const productoBase = baseProductos.find(p => p.id === id);
    carritoItems.push({ ...productoBase, cantidad: 1 });
  }
  actualizarVistaCarrito();
  mostrarNotificacion("Producto añadido correctamente.");
}

function cambiarCantidad(id, cambio) {
  const item = carritoItems.find(item => item.id === id);
  if (!item) return;

  item.cantidad += cambio;
  if(item.cantidad <= 0) {
    carritoItems = carritoItems.filter(item => item.id !== id);
  }
  actualizarVistaCarrito();
}

function actualizarVistaCarrito() {
  listaCarrito.innerHTML = "";
  
  if(carritoItems.length === 0) {
    listaCarrito.innerHTML = `
      <div class="carrito-vacio">
        <p>🛒</p>
        <p>Tu carrito está vacío</p>
      </div>
    `;
    contadorCarrito.textContent = "0";
    totalPrecio.textContent = "$0.00";
    return;
  }

  let cuentaTotalProductos = 0;
  let sumaTotalPrecios = 0;

  carritoItems.forEach(item => {
    cuentaTotalProductos += item.cantidad;
    sumaTotalPrecios += item.precio * item.cantidad;

    const fila = document.createElement("div");
    fila.className = "carrito-item";
    fila.innerHTML = `
      <div class="carrito-item-emoji">${item.emoji}</div>
      <div class="carrito-item-info">
        <div class="carrito-item-nombre">${item.nombre}</div>
        <div class="carrito-item-precio">$${item.precio.toFixed(2)}</div>
      </div>
      <div class="carrito-item-cantidad">
        <button class="btn-cantidad menos" data-id="${item.id}">-</button>
        <span class="carrito-item-num">${item.cantidad}</span>
        <button class="btn-cantidad mas" data-id="${item.id}">+</button>
      </div>
    `;
    listaCarrito.appendChild(fila);
  });

  contadorCarrito.textContent = cuentaTotalProductos;
  totalPrecio.textContent = `$${sumaTotalPrecios.toFixed(2)}`;

  listaCarrito.querySelectorAll(".btn-cantidad.menos").forEach(btn => {
    btn.addEventListener("click", () => cambiarCantidad(parseInt(btn.getAttribute("data-id")), -1));
  });
  listaCarrito.querySelectorAll(".btn-cantidad.mas").forEach(btn => {
    btn.addEventListener("click", () => cambiarCantidad(parseInt(btn.getAttribute("data-id")), 1));
  });
}

function mostrarNotificacion(mensaje) {
  toast.textContent = mensaje;
  toast.classList.add("visible");
  setTimeout(() => {
    toast.classList.remove("visible");
  }, 2500);
}

document.addEventListener("DOMContentLoaded", inicializarTienda);
