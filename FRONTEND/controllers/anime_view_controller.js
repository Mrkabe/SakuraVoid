// FRONTEND/controllers/anime_view_controller.js

const animeId = new URLSearchParams(window.location.search).get("id");
const animeViewContainer = document.getElementById("animeViewContainer");
const episodeList = document.getElementById("episodeList");
const videoPlayer = document.getElementById("videoPlayer");

async function loadAnime() {
  if (!animeId || !animeViewContainer) return;

  try {
    const res = await fetch(`${local_url}/animes/${animeId}`);
    if (!res.ok) throw new Error("Anime no encontrado");
    const anime = await res.json();

    renderAnimeDetails(anime);
    loadEpisodes(anime._id);
  } catch (err) {
    console.error("Error al cargar anime:", err);
    animeViewContainer.innerHTML = "<p style='color: white;'>No se pudo cargar el anime.</p>";
  }
}

function renderAnimeDetails(anime) {
  animeViewContainer.innerHTML = `
    <div class="card bg-dark text-white">
      <img src="${anime.imgUrl}" class="card-img-top" alt="${anime.title}" style="object-fit: cover; max-height: 300px;">
      <div class="card-body">
        <h3 class="card-title">${anime.title}</h3>
        <p class="card-text">${anime.description || ''}</p>
        <p class="card-text"><small class="text-muted">by ${anime.uploadedBy?.name || 'Anon'}</small></p>
      </div>
    </div>
  `;
}

async function loadEpisodes(animeId) {
  if (!episodeList) return;

  try {
    const res = await fetch(`${local_url}/episodes/anime/${animeId}`);
    if (!res.ok) throw new Error("No se pudieron cargar los episodios");
    const episodes = await res.json();

    episodeList.innerHTML = "";
    episodes.forEach(episode => {
      const li = document.createElement("li");
      li.className = "list-group-item list-group-item-action";
      li.style.cursor = "pointer";
      li.innerText = `${episode.number}. ${episode.title}`;
      li.addEventListener("click", () => {
        videoPlayer.src = episode.videoUrl;
        videoPlayer.play();
      });
      episodeList.appendChild(li);
    });

    if (episodes[0]) {
      videoPlayer.src = episodes[0].videoUrl;
    }
  } catch (err) {
    console.error("Error al cargar episodios:", err);
    episodeList.innerHTML = "<li class='list-group-item text-danger'>No se encontraron episodios</li>";
  }
}

window.addEventListener("DOMContentLoaded", loadAnime);
