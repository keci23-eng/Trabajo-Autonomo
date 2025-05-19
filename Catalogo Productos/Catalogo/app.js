const contenedorProductos = document.getElementById('productos');
const inputBusqueda = document.getElementById('busqueda'); // Corregido de "imputBusqueda" a "inputBusqueda"
const contenedorCategorias = document.getElementById('categorias');
let productos = [];
let categoriaSeleccionada = "all";

async function cargarProductos() {
  try {
    mostrarMensaje('Cargando productos...'); // Mensaje de carga
    const response = await fetch('https://fakestoreapi.com/products');
    if (!response.ok) {
      throw new Error('Error en la respuesta de la API');
    }
    const products = await response.json();
    productos = products; // Guardar los productos en la variable global
 
    if (products.length === 0) {
      console.log('No hay productos disponibles');
    } else {
      mostrarProductos(products);
    }
  } catch (error) {
    console.error('Error al cargar los productos:', error);
    mostrarMensaje('Error al cargar los productos. Por favor, inténtalo de nuevo más tarde.');
  }
}
async function cargarCategorias() {
  try{
    const respuesta = await fetch("https://fakestoreapi.com/products/categories");
    if (!respuesta.ok) {
      throw new Error('Error en la respuesta de la API');
    }
    const categorias = await respuesta.json();
    mostrarCategorias(["all", ...categorias]);
  } catch (error) {
    console.error('Error al cargar la categoría:', error);
   
  }
}

function filtrarProductos() {
  let filtrados = productos; // Usar la variable global productos
  if (categoriaSeleccionada !== "all") {
    filtrados = filtrados.filter(p => p.category === categoriaSeleccionada);
  }
  const texto= inputBusqueda.value.toLowerCase();
  if (texto.trim() !== '') {
    filtrados = filtrados.filter(p =>
      p.title.toLowerCase().includes(texto) ||
      p.description.toLowerCase().includes(texto)
    );
  }
  mostrarProductos(filtrados); // Mostrar los productos filtrados
}
 
function mostrarMensaje(mensaje) {
  contenedorProductos.innerHTML = `
    <p class="text-gray-500 text-center">${mensaje}</p>
  `;
}
function mostrarCategorias(categorias) {
  contenedorCategorias.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevas categorías
  categorias.forEach(cat => {
    const btn = document.createElement("button"); // Cambié "categoriaDiv" a "btn"
    btn.textContent = cat === "all" ? "Todos" : cat.charAt(0).toUpperCase() + cat.slice(1);
    btn.className = `px-4 py-2 rounded-full ${
      categoriaSeleccionada === cat ? "bg-white hover:bg-blue-600 text-yellow" : "bg-white hover:bg-blue-600 text-black"
    } font-semibold mr-2 mb-2 transition-colors duration-300`;
    btn.addEventListener("click", () => {
      categoriaSeleccionada = cat;
      mostrarCategorias(categorias);
      filtrarProductos();
    });
    contenedorCategorias.appendChild(btn); // Agregar el botón al contenedor
  });
}

function mostrarProductos(products) {
  contenedorProductos.innerHTML = '';
  products.forEach(product => {
    const productDiv = document.createElement('div');
    productDiv.className =
      'bg-white rounded-lg shadow-md p-4 flex flex-col items-center hover:shadow-white transition-shadow duration-300';
    productDiv.innerHTML = `
      <img src="${product.image}" alt="${product.title}" class="w-32 h-32 object-cover mb-4 rounded-lg">
      <h2 class="text-lg font-semibold mb-2">${product.title}</h2>
      <p class="text-gray-700 mb-2">$${product.price}</p>
      <button class="ver-detalles-btn bg-black text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300 mt-2">Ver detalles</button>
    `;
    // Botón ver detalles
    const verDetallesBtn = productDiv.querySelector('.ver-detalles-btn');
    verDetallesBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      window.location.href = `detalle.html?id=${product.id}`;
    });
    contenedorProductos.appendChild(productDiv);
  });
}

 inputBusqueda.addEventListener('input', filtrarProductos); 

document.addEventListener('DOMContentLoaded', () => {
  cargarCategorias();
  cargarProductos();

});

// --- Cierre de sesión ---
const logoutBtn = document.getElementById('logoutBtn');

function mostrarBotonLogout() {
  if (localStorage.getItem('token')) {
    logoutBtn.classList.remove('hidden');
  } else {
    logoutBtn.classList.add('hidden');
  }
}

if (logoutBtn) {
  mostrarBotonLogout();
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  });
}

// Redirección si no hay token 
if (!localStorage.getItem('token')) {
  window.location.href = 'login.html';
}



