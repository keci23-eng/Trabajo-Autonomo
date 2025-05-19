
document.addEventListener('DOMContentLoaded', () => {
  const login = document.getElementById('logearse');
  const errorMensaje = document.getElementById('mensajeError');

  login.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    try {
      const response = await fetch('https://fakestoreapi.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        window.location.href = 'Tienda de Productos.html'; // Redirigir a la tienda de productos
      } else {
        errorMensaje.classList.remove('hidden');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      errorMensaje.classList.remove('hidden');
    }
  });
});
