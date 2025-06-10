const contenedorProductos = document.getElementById('productos');
const inputBusqueda = document.getElementById('busqueda');
const contenedorCategorias = document.getElementById('categorias');


let productos = [];
let categoriaSeleccionada = "all";

async function cargarProductos() {
  try {
    mostrarMensaje('Cargando productos...');
    const response = await fetch('http://127.0.0.1:8000/api/productos');

    if (!response.ok) throw new Error('Error cargando productos');

    productos = await response.json();
    mostrarProductos(productos);
  } catch (error) {
    mostrarMensaje('Error al cargar productos.');
    console.error(error);
  }
}

async function cargarCategorias() {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/categorias');
    if (!response.ok) throw new Error('Error cargando categorías');

    const categorias = await response.json();
    mostrarCategorias(["all", ...categorias.map(c => c.nombre)]);
  } catch (error) {
    console.error('Error al cargar categorías:', error);
  }
}

function mostrarMensaje(mensaje) {
  contenedorProductos.innerHTML = `<p class="text-center text-gray-500">${mensaje}</p>`;
}

function mostrarCategorias(categorias) {
  contenedorCategorias.innerHTML = '';
  categorias.forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat === "all" ? "Todos" : cat;
    btn.className = `px-4 py-2 rounded-full ${
      categoriaSeleccionada === cat ? "bg-blue-500 text-white" : "bg-white text-black"
    } font-semibold mr-2 mb-2 border`;

    btn.addEventListener("click", () => {
      categoriaSeleccionada = cat;
      mostrarCategorias(categorias);
      filtrarProductos();
    });

    contenedorCategorias.appendChild(btn);
  });
}

function filtrarProductos() {
  let filtrados = productos;

  if (categoriaSeleccionada !== "all") {
    filtrados = filtrados.filter(p =>
      p.categorias.some(cat => cat.nombre === categoriaSeleccionada)
    );
  }

  const texto = inputBusqueda.value.toLowerCase();
  if (texto.trim() !== '') {
    filtrados = filtrados.filter(p =>
      p.titulo.toLowerCase().includes(texto) ||
      p.descripcion.toLowerCase().includes(texto)
    );
  }

  mostrarProductos(filtrados);
}

function mostrarProductos(products) {
  contenedorProductos.innerHTML = '';
  products.forEach(product => {
    const div = document.createElement('div');
    div.className = 'bg-white p-4 rounded shadow hover:shadow-lg transition duration-300 flex flex-col items-center';
    div.innerHTML = `
      <img src="${product.imagen}" alt="${product.titulo}" class="w-32 h-32 object-cover mb-2 rounded">
      <h2 class="font-bold text-center">${product.titulo}</h2>
      <p class="text-gray-600 text-sm text-center">${product.descripcion.substring(0, 60)}...</p>
      <p class="mt-2 font-semibold">$${product.precio}</p>
    `;
    contenedorProductos.appendChild(div);
  });
}

inputBusqueda.addEventListener('input', filtrarProductos);

document.addEventListener('DOMContentLoaded', () => {
  cargarCategorias();
  cargarProductos();
});
