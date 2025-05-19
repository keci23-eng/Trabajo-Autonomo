// detalle.js
// Lógica para mostrar el detalle del producto

document.addEventListener('DOMContentLoaded', () => {
  // Proteger la página: solo usuarios autenticados
  if (!localStorage.getItem('token')) {
    window.location.href = 'login.html';
    return;
  }

  // Botón volver a la tienda
  const volverBtn = document.getElementById('volverBtn');
  volverBtn.addEventListener('click', () => {
    window.location.href = 'Tienda de productos.html';
  });

  // Botón cerrar sesión
  const logoutBtn = document.getElementById('logoutBtn');
  if (localStorage.getItem('token')) {
    logoutBtn.classList.remove('hidden');
  }
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  });

  // Obtener ID del producto de la URL
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const detalleDiv = document.getElementById('detalleProducto');

  if (!id) {
    detalleDiv.innerHTML = '<p class="text-red-500">ID de producto no especificado.</p>';
    return;
  }

  // Obtener datos del producto
  fetch(`https://fakestoreapi.com/products/${id}`)
    .then(res => res.json())
    .then(producto => {
      detalleDiv.innerHTML = `
        <img src="${producto.image}" alt="${producto.title}" class="w-40 h-40 object-contain mx-auto mb-4">
        <h2 class="text-2xl font-bold mb-2">${producto.title}</h2>
        <p class="text-lg text-blue-600 font-semibold mb-2">$${producto.price}</p>
        <p class="mb-4 text-gray-700">${producto.description}</p>
        <span class="inline-block bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm mb-2">${producto.category}</span>
      `;
    })
    .catch(() => {
      detalleDiv.innerHTML = '<p class="text-red-500">No se pudo cargar el producto.</p>';
    });
});
