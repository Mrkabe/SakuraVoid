
//Funcion para mostrar el nombre de usuario y la cantidad de animes que ha subido a la plataforma.
async function renderUserCardPerfil() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  if (!user) return;

  const userCard = document.querySelector(".card.text-white.text-center.p-4");
  if (!userCard) return;

  try {
    const token = sessionStorage.getItem("token");
    const res = await fetch(`${local_url}/animes`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const animes = await res.json();
    const mios = animes.filter(a => a.uploadedBy?._id === user.id || a.uploadedBy === user.id);

    userCard.innerHTML = `
      <h5>${user.name}</h5>
      <p>@${user.name.replace(/\s+/g, '').toLowerCase()}</p>
      <p><strong>${mios.length}</strong> animes subidos</p>
    `;
  } catch (err) {
    console.error("Error al contar animes del usuario:", err);
  }
}

//funcion para mostrar los usuarios que sigue, y sus animes.
async function renderUsuariosSeguidos() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const token = sessionStorage.getItem("token");
  const container = document.getElementById("ContenedorUsuariosSeguidos");
  const animesContainer = document.getElementById("AnimesDeUsuarioSeguido");

  if (!user || !token || !container || !animesContainer) return;

  try {
    const res = await fetch(`${local_url}/users/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    const seguidos = data.siguiendo || [];
    const siguiendoIds = seguidos.map(u => u._id || u);

    container.innerHTML = "";
    animesContainer.innerHTML = "<p style='color:white'>Selecciona un usuario para ver sus animes</p>";

    for (const usuario of seguidos) {
      const card = document.createElement("div");
      card.className = "card";
      card.style = "background-color: #251479; color: white; padding: 10px; margin-bottom: 10px; cursor: pointer;";

      const usuarioId = usuario._id;
      const handle = "@" + usuario.name.replace(/\s+/g, '').toLowerCase();
      const yaLoSigues = siguiendoIds.includes(usuarioId);

      card.innerHTML = `
        <h5>${usuario.name}</h5>
        <p>${handle}</p>
        <button class="btn btn-sm btn-light mt-2" data-target-id="${usuarioId}">
          ${yaLoSigues ? "Dejar de seguir" : "Seguir"}
        </button>
      `;

      // Botón seguir/dejar de seguir
      const seguirBtn = card.querySelector("button[data-target-id]");
      seguirBtn.addEventListener("click", async (e) => {
        e.stopPropagation(); // evitar que dispare el click de la card

        try {
          const res = await fetch(`${local_url}/users/follow`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ targetUserId: usuarioId })
          });

          const result = await res.json();
          seguirBtn.textContent = result.following ? "Dejar de seguir" : "Seguir";
          await renderUsuariosSeguidos(); // refrescar lista
        } catch (err) {
          console.error("❌ Error al seguir/dejar de seguir:", err);
        }
      });

      // Cargar animes del usuario al hacer clic en la tarjeta
      card.addEventListener("click", async () => {
        animesContainer.innerHTML = `<p style="color:white">Cargando animes de ${handle}...</p>`;
        try {
          const animeRes = await fetch(`${local_url}/animes`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const animes = await animeRes.json();
          const delUsuario = animes.filter(a => a.uploadedBy?._id === usuarioId || a.uploadedBy === usuarioId);

          animesContainer.innerHTML = "";
          if (delUsuario.length === 0) {
            animesContainer.innerHTML = `<p style="color:white">Este usuario no ha subido animes aún.</p>`;
          } else {
            delUsuario.forEach(anime => renderAnimeCard(anime, animesContainer));
          }
        } catch (err) {
          console.error("Error al cargar animes del usuario:", err);
          animesContainer.innerHTML = `<p style="color:red">Error al cargar animes.</p>`;
        }
      });

      container.appendChild(card);
    }

  } catch (err) {
    console.error("Error al cargar usuarios seguidos:", err);
  }
}




async function renderPerfilConsultado() {
  const currentUser = JSON.parse(sessionStorage.getItem("user"));
  const token = sessionStorage.getItem("token");
  const params = new URLSearchParams(window.location.search);
  const perfilId = params.get("id");

  if (!perfilId || !currentUser) {
  if (bloque) bloque.style.display = "none";
  return;
}

if (perfilId === currentUser.id) {
  if (botonSeguir) botonSeguir.style.display = "none";
}

  const bloque = document.getElementById("bloqueUsuarioConsultado");
  const nombre = document.getElementById("nombreUsuarioConsultado");
  const arroba = document.getElementById("arrobaUsuarioConsultado");
  const botonSeguir = document.getElementById("btnSeguirUsuario");
  const contenedor = document.getElementById("ContenedorIndividualPerfilConsultado");

  try {
    // 1. Mostrar el bloque
    bloque.style.display = "block";

    // 2. Obtener info del usuario consultado
    const res = await fetch(`${local_url}/users/${perfilId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const usuario = await res.json();

    nombre.textContent = usuario.name;
    arroba.textContent = "@" + usuario.name.replace(/\s+/g, '').toLowerCase();

    // 3. Cambiar texto del botón si ya lo sigues
    const yaLoSigues = (usuario.followers || []).some(f => f._id === currentUser.id || f === currentUser.id);
    botonSeguir.textContent = yaLoSigues ? "Dejar de seguir" : "Seguir";
    botonSeguir.dataset.targetId = usuario._id;

    // 4. Mostrar sus animes
    const animesRes = await fetch(`${local_url}/animes`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const todos = await animesRes.json();
    const suyos = todos.filter(a => a.uploadedBy?._id === perfilId || a.uploadedBy === perfilId);

    contenedor.innerHTML = "";
    suyos.forEach(anime => renderAnimeCard(anime, contenedor)); // usa tu renderizador ya existente
  } catch (err) {
    console.error("Error al renderizar perfil consultado:", err);
  }
}


window.toggleFollowUsuario = async function (event) {
  const btn = event?.target || document.getElementById("btnSeguirUsuario"); // Soporta ambos
  const token = sessionStorage.getItem("token");

  if (!btn || !token) return;

  const targetId = btn.dataset.targetId;

  try {
    const res = await fetch(`${local_url}/users/follow`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ targetUserId: targetId })
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Error en respuesta:", text);
      throw new Error("Fallo al actualizar seguimiento");
    }

    const data = await res.json();
    btn.textContent = data.following ? "Dejar de seguir" : "Seguir";
  } catch (err) {
    console.error("Error al seguir/dejar de seguir:", err);
    alert("No se pudo actualizar el seguimiento.");
  }
};

// Desplazarse hacia la sección del usuario consultado
function scrollWhenReady() {
  const contenedor = document.getElementById("ContenedorIndividualPerfilConsultado");
  if (!contenedor) return setTimeout(scrollWhenReady, 100);

  const observer = new MutationObserver(() => {
    const target = document.getElementById("bloqueUsuarioConsultado");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      observer.disconnect();
    }
  });

  observer.observe(contenedor, { childList: true });
}
scrollWhenReady();

document.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname;

  if (currentPath.includes("perfil.html")) {
    renderUserCardPerfil();
    renderUsuariosSeguidos();
    renderPerfilConsultado();
  }
});
