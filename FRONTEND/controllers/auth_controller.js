// FRONTEND/controllers/auth_controller.js

function toggleForms() {
  document.getElementById("formLogin").classList.toggle("d-none");
  document.getElementById("formRegister").classList.toggle("d-block");
}


function login() {
  event.preventDefault();
  const data = new FormData(event.target);
  const credentials = Object.fromEntries(data.entries());

  fetch(`${local_url}/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
    .then(res => {
      if (!res.ok) {
        alert("Correo y/o contraseña incorrectos");
        throw new Error("Login fallido");
      }
      return res.json();
    })
    .then(data => {
      sessionStorage.setItem('user', JSON.stringify(data.user));
      sessionStorage.setItem('token', data.token);
      window.location.href = `${local_url}/home.html`;
    })
    .catch(err => {
      console.error("Error en login:", err);
    });
}

function logout() {
  sessionStorage.clear();
  window.location.href = `${local_url}/login.html`;
}
    

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("formLogin");
  if (loginForm) loginForm.addEventListener("submit", login);

  const registerForm = document.getElementById("formRegister");
  if (registerForm) registerForm.addEventListener("submit", register);
});


async function register(event) {
  event.preventDefault();

  const name = document.getElementById("registerName").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;
  const confirm = document.getElementById("registerConfirmPassword").value;

  if (password !== confirm) return alert("Las contraseñas no coinciden");

  try {
    const res = await fetch(`${local_url}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (res.ok) {
      alert('Cuenta creada con éxito. Ahora inicia sesión.');
      toggleForms();
    } else {
      alert(data.error || 'No se pudo crear la cuenta');
    }
  } catch (err) {
    console.error(err);
    alert('Error en la conexión con el servidor');
  }
}

function deleteAccount() {
  const user = getCurrentUser();
  const token = sessionStorage.getItem('token');

  if (!user || !token) return alert("No hay sesión activa");

  const confirmDelete = confirm("¿Estás seguro de que deseas eliminar tu cuenta?");
  if (!confirmDelete) return;

  fetch(`${local_url}/api/users/${user.id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => {
      if (!res.ok) throw new Error("Error al eliminar la cuenta");
      alert("Cuenta eliminada exitosamente");
      logout(); // cerrar sesión automáticamente
    })
    .catch(err => {
      console.error(" Error al eliminar cuenta:", err);
      alert("No se pudo eliminar la cuenta");
    });
}

function updateProfile(updatedData) {
  const user = getCurrentUser();
  const token = sessionStorage.getItem('token');

  return fetch(`${local_url}/api/users/${user.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(updatedData)
  })
    .then(res => res.json())
    .then(data => {
      sessionStorage.setItem('user', JSON.stringify(data));
      alert("Perfil actualizado");
      return data;
    })
    .catch(err => {
      console.error(" Error al actualizar perfil:", err);
      alert("No se pudo actualizar el perfil");
    });
}

