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
  card.className = "anime-card";
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

  const verBtnYAutor = `
    <a href="perfil.html?id=${anime.uploadedBy?._id || anime.uploadedBy}" style="background-color: #7F00B2; color: white; font-size: 12px;">
      by ${anime.uploadedBy?.name || 'Anon'}
    </a>

    <a href="anime.html?id=${anime._id}" title="Ver Anime">
      <button style="margin-left: 10px; font-size: 12px; background: linear-gradient(to right, #007bff, #ff69b4); color: white; border: none; border-radius: 4px;">
        <strong>Ver</strong>
      </button>
    </a>
`;


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
if (btnModificarAnime) {
  btnModificarAnime.addEventListener("click", () => {
    const modalElement = document.getElementById("modalEditarAnime");
    if (!modalElement) {
      console.error("El modal #modalEditarAnime no se encontró en el DOM.");
      return;
    }
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  });
}


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
    const modal = new bootstrap.Modal(document.getElementById("modalEliminarEpisodio"));
    await cargarEpisodiosEnSelectEliminar();
    modal.show();
  });
}

  

  if (btnModificarEpisodio) {
  btnModificarEpisodio.addEventListener("click", async () => {
    const modal = new bootstrap.Modal(document.getElementById("modalEditarEpisodio"));
    await cargarEpisodiosEnSelect();
    modal.show();
  });
}

});

let selectedAnimeId = null;


function setSelectedAnimeId(id) {
  selectedAnimeId = id;
}

// Detectar el anime seleccionado (cuando se abre el modal)
document.querySelectorAll(".card").forEach(card => {
  card.addEventListener("click", () => {
    selectedAnimeId = card.getAttribute("data-anime-id");
  });
});

async function confirmarEdicionAnime() {
  const token = sessionStorage.getItem("token");
  if (!selectedAnimeId || !token) return alert("Anime no seleccionado");

  const titulo = document.getElementById("editarTitulo").value;
  const descripcion = document.getElementById("editarDescripcion").value;
  const imagen = document.getElementById("editarImagen").files[0];

  const formData = new FormData();
  if (titulo) formData.append("title", titulo);
  if (descripcion) formData.append("description", descripcion);
  if (imagen) formData.append("file", imagen);

  try {
    const res = await fetch(`${API_ANIMES}/${selectedAnimeId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });

    const data = await res.json();
    alert("Anime actualizado");
    location.reload();
  } catch (err) {
    console.error(err);
    alert("Error al actualizar anime");
  }
}

async function cargarEpisodiosEnSelect() {
  const select = document.getElementById("selectNumeroEpisodio");
  select.innerHTML = `<option value="">Selecciona el número del episodio</option>`;

  try {
    const res = await fetch(`${local_url}/episodes/anime/${selectedAnimeId}`);
    const episodios = await res.json();

    episodios.forEach(ep => {
      const opt = document.createElement("option");
      opt.value = ep._id;
      opt.textContent = `#${ep.number} - ${ep.title}`;
      select.appendChild(opt);
    });
  } catch (err) {
    console.error("Error al cargar episodios:", err);
  }
}

async function confirmarEdicionEpisodio() {
  const token = sessionStorage.getItem("token");
  const episodioId = document.getElementById("selectNumeroEpisodio").value;
  const nuevoTitulo = document.getElementById("nuevoTituloEpisodio").value;
  const nuevoVideo = document.getElementById("nuevoVideoEpisodio").files[0];

  if (!episodioId) return alert("Selecciona un episodio");

  const formData = new FormData();
  if (nuevoTitulo) formData.append("title", nuevoTitulo);
  if (nuevoVideo) formData.append("file", nuevoVideo);

  try {
    const res = await fetch(`${local_url}/episodes/${episodioId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });

    const data = await res.json();
    alert("Episodio modificado");
    location.reload();
  } catch (err) {
    console.error(err);
    alert("Error al modificar el episodio");
  }
}

async function cargarEpisodiosEnSelectEliminar() {
  const select = document.getElementById("selectEliminarEpisodio");
  select.innerHTML = `<option value="">Selecciona un episodio</option>`;

  try {
    const res = await fetch(`${local_url}/episodes/anime/${selectedAnimeId}`);
    const episodios = await res.json();

    episodios.forEach(ep => {
      const opt = document.createElement("option");
      opt.value = ep._id;
      opt.textContent = `#${ep.number} - ${ep.title}`;
      select.appendChild(opt);
    });
  } catch (err) {
    console.error("Error al cargar episodios para eliminación:", err);
  }
}

async function confirmarEliminacionEpisodio() {
  const token = sessionStorage.getItem("token");
  const episodioId = document.getElementById("selectEliminarEpisodio").value;
  if (!episodioId) return alert("Selecciona un episodio");

  if (!confirm("¿Estás seguro de que deseas eliminar este episodio?")) return;

  try {
    const res = await fetch(`${local_url}/episodes/${episodioId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    alert(data.message || "Episodio eliminado");
    location.reload();
  } catch (err) {
    console.error("Error al eliminar episodio:", err);
    alert("Error al eliminar episodio");
  }
}


