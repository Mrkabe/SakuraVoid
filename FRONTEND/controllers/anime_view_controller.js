// FRONTEND/controllers/anime_view_controller.js

window.addEventListener("DOMContentLoaded", loadAnime);

async function loadAnime() {
  const animeId = new URLSearchParams(window.location.search).get("id");
  const animeViewContainer = document.getElementById("animeViewContainer");
  const episodeList = document.getElementById("episodeList");
  const videoPlayer = document.getElementById("videoPlayer");

  console.log("✅ loadAnime se está ejecutando");
  console.log("📦 animeId extraído:", animeId);
  console.log("🧱 Elementos del DOM:", {
    animeViewContainer,
    episodeList,
    videoPlayer
  });

  if (!animeId || !animeViewContainer) return;

  try {
    const res = await fetch(`${local_url}/animes/${animeId}`);
    if (!res.ok) throw new Error("Anime no encontrado");
    const anime = await res.json();

    renderAnimeDetails(anime, animeViewContainer);
    loadEpisodes(anime._id, videoPlayer, episodeList);
  } catch (err) {
    console.error("Error al cargar anime:", err);
    animeViewContainer.innerHTML = "<p style='color: white;'>No se pudo cargar el anime.</p>";
  }
}

function renderAnimeDetails(anime, container) {
  if (!container) return;

  container.innerHTML = `
    <img class="card-img-top" src="${anime.imgUrl}" alt="${anime.title}" style="height: 60%; object-fit: cover;">
    <div class="card-body" style="display: flex; flex-direction: column; flex-grow: 1; padding: 10px; font-size: 12px; justify-content: space-between;">
      <h4 class="card-title" style="font-size: 14px; margin: 0;">${anime.title}</h4>
      <p class="card-text" style="font-size: 12px; margin-top: 5px;">${anime.description || ''}</p>
      <h1 style="background-color: #7F00B2; color: white; font-size: 12px; text-align: center;">by @${anime.uploadedBy?.name || 'Anon'}</h1>
      <a href="perfil.html"><button style="margin-bottom: 10px; font-size: 12px; background: linear-gradient(to right, #007bff, #ff69b4); color: white; border: none; border-radius: 4px; padding: 6px; cursor: pointer;"><strong>Seguir al usuario</strong></button></a>
    </div>
  `;
}

async function loadEpisodes(animeId, video, listContainer) {
  if (!listContainer || !video) return;

  try {
    const res = await fetch(`${local_url}/episodes/anime/${animeId}`);
    if (!res.ok) throw new Error("No se pudieron cargar los episodios");
    const episodes = await res.json();

    listContainer.innerHTML = "";
    episodes.forEach(episode => {
      const li = document.createElement("li");
      li.className = "list-group-item list-group-item-action";
      li.style.cursor = "pointer";
      li.innerText = `${episode.number}. ${episode.title}`;
      li.addEventListener("click", () => {
        video.src = episode.videoUrl;
        video.play();
      });
      listContainer.appendChild(li);
    });

    if (episodes[0]) {
      video.src = episodes[0].videoUrl;
    }
  } catch (err) {
    console.error("Error al cargar episodios:", err);
    listContainer.innerHTML = "<li class='list-group-item text-danger'>No se encontraron episodios</li>";
  }
}
