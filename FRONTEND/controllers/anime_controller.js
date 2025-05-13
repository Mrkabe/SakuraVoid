// FRONTEND/controllers/anime_controller.js

const API_ANIMES = `${local_url}/animes`;
const API_USERS = `${local_url}/users`;
const API_EPISODES = `${local_url}/episodes`;

const currentPath = window.location.pathname;

let favoriteIds = [];


// Obtener todos los animes
async function getAllAnimes() {
  try {
    const res = await fetch(API_ANIMES);
    if (!res.ok) throw new Error("Fallo al obtener animes");
    return await res.json();
  } catch (err) {
    console.error("Error en getAllAnimes:", err);
    return [];
  }
}

// Obtener los favoritos del usuario actual
async function getUserFavorites() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const token = sessionStorage.getItem("token");
  if (!user || !token) return [];

  const res = await fetch(`${API_USERS}/${user.id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  return data.favoritos || [];
}

// Toggle favorito
async function toggleFavorite(animeId) {
  const token = sessionStorage.getItem("token");
  if (!token) return;

  const res = await fetch(`${API_USERS}/favoritos`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ animeId })
  });

  return await res.json();
}

// Renderiza una card de anime y la inserta en un contenedor
function renderAnimeCard(anime, container) {
  if (!anime || !anime._id || !anime.title) return;

  const card = document.createElement("div");
  card.className = "card";
  card.setAttribute("data-anime-id", anime._id);

  const currentPath = window.location.pathname;
  const user = JSON.parse(sessionStorage.getItem("user"));
  const isPerfil = currentPath.includes("perfil.html");
  const isOwner = user && (anime.uploadedBy?._id === user.id || anime.uploadedBy === user.id);

  const modificarBtn = isPerfil && isOwner ? `
    <button class="btn btn-primary btn-sm" style="margin-left: 10px; font-size: 12px; background: linear-gradient(to right, #007bff, #ff69b4);"
      data-bs-toggle="modal" data-bs-target="#modalModificarAnime" onclick="setSelectedAnimeId('${anime._id}')">
      <i class="fas fa-pen"></i> Modificar
    </button>
  ` : '';

  const verBtnYAutor = !isPerfil ? `
    <a href="perfil.html" style="background-color: #7F00B2; color: white; font-size: 12px;">by ${anime.uploadedBy?.name || 'Anon'}</a>
    <a href="anime.html?id=${anime._id}" title="MiAnime">
      <button style="margin-left: 10px; font-size: 12px; background: linear-gradient(to right, #007bff, #ff69b4); color: white; border: none; border-radius: 4px;">
        <strong>Ver</strong>
      </button>
    </a>
  ` : '';

  card.style = "width: 200px; height: 350px; display: flex; flex-direction: column; color: white; background-color: #251479; position: relative;";
  card.innerHTML = `
    <i class="fa-heart favorite-icon ${favoriteIds.includes(anime._id) ? 'fa-solid' : 'fa-regular'}" data-id="${anime._id}" title="Favorito"
      style="position: absolute; top: 10px; right: 10px; color: white; font-size: 20px; cursor: pointer;"></i>
    <img class="card-img-top" src="${anime.imgUrl || 'https://via.placeholder.com/200x150?text=Sin+imagen'}" alt="${anime.title}" style="height: 60%; object-fit: cover;">
    <div class="card-body" style="height: 40%; overflow: hidden;">
      <h4 class="card-title" style="font-size: 14px;">${anime.title}</h4>
      <p class="card-text" style="font-size: 12px;">${anime.description || ''}</p>
      ${verBtnYAutor}
      ${modificarBtn}
    </div>
  `;

  container.appendChild(card);

  const icon = card.querySelector(".favorite-icon");
  icon.addEventListener("click", async () => {
    await toggleFavorite(anime._id);
    if (currentPath.includes("favoritos.html")) {
      card.remove();
    } else {
      icon.classList.toggle("fa-solid");
      icon.classList.toggle("fa-regular");
    }
  });
}

// Renderiza los 3 más recientes en el carrusel
function renderCarrusel(animes) {
  const carouselContainer = document.getElementById("carouselContainer");
  if (!carouselContainer) return;

  carouselContainer.innerHTML = "";
  const recientes = [...animes].slice(-3).reverse();

  recientes.forEach((anime, index) => {
    const item = document.createElement("div");
    item.className = `carousel-item ${index === 0 ? 'active' : ''}`;
    item.innerHTML = `
      <div style="display: flex; height: 250px;">
        <img src="${anime.imgUrl}" alt="${anime.title}" style="width: 65%; object-fit: cover;">
        <div style="width: 35%; color: white; padding: 10px; margin-top: 30px;">
          <h5>${anime.title}</h5>
          <p style="font-size: 12px;">${anime.description || ''}</p>
          <p style="font-size: 12px;"><em>by: <strong>${anime.uploadedBy?.name || '@anon'}</strong></em></p>
          <a href="anime.html?id=${anime._id}" title="MiAnime">
            <button style="padding: 6px 12px; font-size: 12px; background: linear-gradient(to right, #007bff, #ff69b4); color: white; border: none; border-radius: 4px;"><strong>Empezar anime</strong></button>
          </a>
        </div>
      </div>
    `;
    carouselContainer.appendChild(item);
  });
}

// Carga los favoritos del usuario
async function renderFavorites() {
  const container = document.getElementById("favoriteAnimeContainer");
  if (!container) return;

  const favoritos = await getUserFavorites();
  favoriteIds = favoritos.map(f => f._id);

  container.innerHTML = "";
  favoritos.forEach(anime => renderAnimeCard(anime, container));
}

// Carga los animes que ha subido el usuario actual
async function renderMyUploads() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const token = sessionStorage.getItem("token");
  const container = document.getElementById("myUploadedAnimeContainer");
  if (!user || !token || !container) return;

  const animes = await getAllAnimes();
  const mios = animes.filter(a => {
    const uploader = a.uploadedBy;
    return uploader === user.id || uploader?._id === user.id;
  });

  container.innerHTML = "";
  mios.forEach(anime => renderAnimeCard(anime, container));
}

// Carga dinámica según la página
document.addEventListener("DOMContentLoaded", async () => {
  const path = currentPath;
  const allAnimes = await getAllAnimes();

  if (path.includes("favoritos.html")) {
    await renderFavorites();
  } else {
    const favoritos = await getUserFavorites();
    favoriteIds = favoritos.map(f => f._id);
  }

  if (path.includes("home.html")) {
    renderCarrusel(allAnimes);
    const main = document.getElementById("animeCardContainer");
    if (main) {
      main.innerHTML = "";
      const visibles = allAnimes.length > 3 ? allAnimes.slice(0, -3) : allAnimes;
      visibles.forEach(anime => renderAnimeCard(anime, main));
    }
  }

  if (path.includes("upload.html") || path.includes("perfil.html")) {
    await renderMyUploads();
  }
    // ✅ Integración de listeners del modal (solo si existen en la página)
  const API_ANIMES = `${local_url}/animes`;
  const API_EPISODES = `${local_url}/episodes`;

  const btnEliminarAnime = document.getElementById("btnEliminarAnime");
  const btnEliminarEpisodio = document.getElementById("btnEliminarEpisodio");
  const btnModificarAnime = document.getElementById("btnModificarAnime");
  const btnModificarEpisodio = document.getElementById("btnModificarEpisodio");

  if (btnEliminarAnime) {
    btnEliminarAnime.addEventListener("click", async () => {
      const token = sessionStorage.getItem("token");
      if (!selectedAnimeId || !token) return alert("Anime no seleccionado o no autenticado");

      if (!confirm("¿Estás seguro de eliminar este anime y todos sus episodios?")) return;

      try {
        const res = await fetch(`${API_ANIMES}/${selectedAnimeId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        alert(data.message || "Anime eliminado");
        location.reload();
      } catch (err) {
        console.error(err);
        alert("Error al eliminar el anime");
      }
    });
  }

  if (btnEliminarEpisodio) {
  btnEliminarEpisodio.addEventListener("click", async () => {
    const token = sessionStorage.getItem("token");
    if (!selectedAnimeId || !token) return alert("Anime no seleccionado o no autenticado");

    const numero = prompt("Número del episodio a eliminar:");
    if (!numero) return;

    try {
      const res = await fetch(`${API_EPISODES}/deleteByNumber`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          headers: { Authorization: `Bearer ${token}` }
        },
        body: JSON.stringify({
          animeId: selectedAnimeId,
          number: numero
        })
      });

      if (!res.ok) {
        const text = await res.text();
        alert(text);
        return;
      }

      const data = await res.json();
      alert(data.message || "Episodio eliminado");
      location.reload();
    } catch (err) {
      console.error(err);
      alert("Error al eliminar episodio");
    }
  });
  }

  if (btnModificarAnime) {
    btnModificarEpisodio.addEventListener("click", async () => {
      const token = sessionStorage.getItem("token");
      if (!selectedAnimeId || !token) return alert("Anime no seleccionado o no autenticado");

      const numero = prompt("Número del episodio a modificar:");
      const nuevoTitulo = prompt("Nuevo título para el episodio:");

      if (!numero || !nuevoTitulo) return;

      try {
        const res = await fetch(`${API_EPISODES}/modifyByNumber`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            headers: { Authorization: `Bearer ${token}` }
          },
          body: JSON.stringify({
            animeId: selectedAnimeId,
            number: numero,
            title: nuevoTitulo
          })
        });

        if (!res.ok) {
          const text = await res.text();
          alert(text);
          return;
        }

        const data = await res.json();
        alert(data.message || "Episodio modificado");
        location.reload();
      } catch (err) {
        console.error(err);
        alert("Error al modificar episodio");
      }
    });
  }

  if (btnModificarEpisodio) {
    btnModificarEpisodio.addEventListener("click", async () => {
      const token = sessionStorage.getItem("token");
      const episodeId = prompt("Introduce el ID del episodio a modificar:");
      const nuevoTitulo = prompt("Nuevo título del episodio:");
      const nuevoNumero = prompt("Nuevo número:");

      if (!episodeId || !nuevoTitulo || !nuevoNumero) return;

      try {
        const res = await fetch(`${API_EPISODES}/${episodeId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            headers: { Authorization: `Bearer ${token}` }
          },
          body: JSON.stringify({
            title: nuevoTitulo,
            number: nuevoNumero
          })
        });
        const data = await res.json();
        alert("Episodio modificado");
        location.reload();
      } catch (err) {
        console.error(err);
        alert("Error al modificar el episodio");
      }
    });
  }
});

let selectedAnimeId = null;

// Aqui es donde esta lo mio
function setSelectedAnimeId(id) {
  selectedAnimeId = id;
}

// Detectar el anime seleccionado (cuando se abre el modal)
document.querySelectorAll(".card").forEach(card => {
  card.addEventListener("click", () => {
    selectedAnimeId = card.getAttribute("data-anime-id");
  });
});
