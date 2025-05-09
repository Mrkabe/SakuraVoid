// FRONTEND/controllers/anime_controller.js

const API_URL = 'http://localhost:3000/api';

// Obtener todos los animes
async function getAllAnimes() {
  const res = await fetch(`${API_URL}/animes`);
  const data = await res.json();
  return data;
}

// Obtener anime por ID
async function getAnimeById(animeId) {
  const res = await fetch(`${API_URL}/animes/${animeId}`);
  const data = await res.json();
  return data;
}

// Toggle de favorito
async function toggleFavorite(animeId) {
  const token = localStorage.getItem('token');

  const res = await fetch(`${API_URL}/users/favoritos`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ animeId })
  });

  return await res.json();
}

// Renderizar una card de anime
function renderAnimeCard(anime, container) {
  const card = document.createElement('div');
  card.className = 'col';
  card.innerHTML = `
    <div class="card text-white shadow rounded-4 h-100 anime-card" style="background-color: #251479;">
      <div style="position: relative;">
        <img src="${anime.imgUrl}" class="card-img-top rounded-top-4" alt="${anime.title}">
        <i class="fa-solid fa-heart favorite-icon" data-anime-id="${anime._id}" style="position: absolute; top: 10px; right: 10px; font-size: 20px; cursor: pointer;"></i>
      </div>
      <div class="card-body">
        <h5 class="card-title">${anime.title}</h5>
        <p class="card-text">${anime.description || ''}</p>
      </div>
      <div class="card-footer bg-transparent border-0 d-flex justify-content-end">
        <a href="anime.html?id=${anime._id}" class="btn btn-sm btn-author" style="background-color: #A032F0;">Ver</a>
      </div>
    </div>
  `;
  container.appendChild(card);
}

// Listener para togglear favoritos en las cards
function initFavoriteListeners() {
  document.querySelectorAll('.favorite-icon').forEach(icon => {
    icon.addEventListener('click', async () => {
      const animeId = icon.dataset.animeId;
      await toggleFavorite(animeId);
      icon.classList.toggle('fa-solid');
      icon.classList.toggle('fa-regular');
    });
  });
}

// Ejecutar si estamos en home.html
if (window.location.pathname.endsWith('home.html')) {
  window.addEventListener('DOMContentLoaded', async () => {
    const container = document.querySelector('.row.row-cols-1');
    if (!container) return;

    try {
      const animes = await getAllAnimes();
      container.innerHTML = '';

      animes.forEach(anime => renderAnimeCard(anime, container));
      initFavoriteListeners();
    } catch (err) {
      console.error('Error al cargar animes:', err);
    }
  });
}

if (window.location.pathname.endsWith('favoritos.html')) {
  window.addEventListener('DOMContentLoaded', async () => {
    const container = document.querySelector('.row.row-cols-1');
    if (!container) return;

    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));

      const res = await fetch(`${API_URL}/users/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      const favoritos = data.favoritos || [];

      container.innerHTML = '';
      favoritos.forEach(anime => renderAnimeCard(anime, container));
      initFavoriteListeners();
    } catch (err) {
      console.error('Error al cargar favoritos:', err);
    }
  });
}

window.getAllAnimes = getAllAnimes;
window.getAnimeById = getAnimeById;
window.renderAnimeCard = renderAnimeCard;
window.initFavoriteListeners = initFavoriteListeners;
