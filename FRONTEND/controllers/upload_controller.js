// FRONTEND/controllers/upload_controller.js

window.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".btn-subir").addEventListener("click", createAnime);
  loadMyAnimes();
  addChapter(); // Cargar un bloque por defecto
});

async function createAnime(btn) {
  const title = document.getElementById("nombre_anime").value;
  const description = document.getElementById("descripcion_anime").value;
  const imageInput = document.querySelector("input[name='avatar_anime']");
  const imageFile = imageInput.files[0];

  const token = sessionStorage.getItem("token");
  if (!token) return alert("Debes iniciar sesión para subir animes.");

  if (!title || !imageFile) return alert("Título e imagen son obligatorios.");

  btn.disabled = true;
  btn.textContent = "Subiendo...";

  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  formData.append("file", imageFile);

  try {
    const res = await fetch(`${local_url}/animes`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    if (!res.ok) throw new Error("Error al crear el anime");
    const newAnime = await res.json();
    alert("Anime creado correctamente");
    location.reload();
  } catch (err) {
    console.error(err);
    alert("Error al subir anime");
  } finally {
    btn.disabled = false;
    btn.textContent = "Subir";
  }
}

async function createEpisode(button) {
  const container = button.closest(".mb-3");
  const number = container.querySelector("input[type='number']").value;
  const title = container.querySelector("input[type='text']").value;
  const file = container.querySelector("input[type='file']").files[0];
  const animeId = container.querySelector("select").value;

  const token = sessionStorage.getItem("token");

  if (!number || !title || !file || !animeId) return alert("Todos los campos del episodio son obligatorios.");

  button.disabled = true;
  button.textContent = "Subiendo...";

  const formData = new FormData();
  formData.append("title", title);
  formData.append("number", number);
  formData.append("file", file);
  formData.append("anime", animeId);

  try {

    //temporal
    console.log([...formData.entries()]);
    for (const [key, val] of formData.entries()) {
      console.log("🧾 Enviando:", key, val);
    }

    const res = await fetch(`${local_url}/episodes`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    if (!res.ok) throw new Error("Error al subir episodio");
    alert("Episodio subido exitosamente");
    location.reload();
  } catch (err) {
    console.error(err);
    alert("Error al subir episodio");
    console.error("🔥 Error en createEpisode:", error);
    res.status(500).json({
    message: "Error al crear episodio",
    error: error.message || error.toString(),
    stack: error.stack
  });
  } finally {
    button.disabled = false;
    button.textContent = "Subir";
  }
}

async function loadMyAnimes() {
  const token = sessionStorage.getItem("token");
  const user = JSON.parse(sessionStorage.getItem("user"));

  if (!token || !user) return;

  try {
    const res = await fetch(`${local_url}/animes`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const animes = await res.json();
    const mine = animes.filter(a => a.uploadedBy?._id === user.id || a.uploadedBy === user.id);

    document.querySelectorAll(".anime-select").forEach(select => {
      select.innerHTML = "<option value=''>Selecciona un anime</option>";
      mine.forEach(anime => {
        const opt = document.createElement("option");
        opt.value = anime._id;
        opt.textContent = anime.title;
        select.appendChild(opt);
      });
    });
  } catch (err) {
    console.error("Error al cargar animes del usuario:", err);
  }
}

function addChapter() {
  const capitulos = document.getElementById('capitulos');
  const nuevo_capitulo = document.createElement('div');

  nuevo_capitulo.classList.add('mb-3', 'p-3', 'rounded');
  nuevo_capitulo.style.backgroundColor = '#0d0b2d';

  nuevo_capitulo.innerHTML = `
    <select class="anime-select form-select mb-3" required>
      <option value="">Selecciona un anime</option>
    </select>
    <input type="number" class="form-control mb-3" placeholder="Número del capítulo" required>
    <input type="text" class="form-control mb-3" placeholder="Título del capítulo" required>
    <input type="file" class="form-control mb-3" accept="video/mp4,video/webm" required>
    <div class="d-flex justify-content-end gap-2">
      <button type="button" class="btn btn-success" onclick="createEpisode(this)">Subir</button>
      <button type="button" class="btn btn-danger" onclick="eliminarCapitulo(this)">Cancelar este capítulo</button>
    </div>
  `;

  capitulos.appendChild(nuevo_capitulo);
  loadMyAnimes();
}

function eliminarCapitulo(btn) {
  const capitulo = btn.closest('div.mb-3');
  capitulo.remove();
}
