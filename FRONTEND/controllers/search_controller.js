document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("buscar");
  const results = document.getElementById("resultadosBusqueda");

  if (!input || !results) return;

  input.addEventListener("input", async () => {
    const query = input.value.trim();
    if (query.length === 0) {
      results.innerHTML = "";
      return;
    }

    try {
      const token = sessionStorage.getItem("token");

      // 🔍 Consultar animes
      const animeRes = await fetch(`${local_url}/animes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const animes = await animeRes.json();
      const filtradosAnimes = animes.filter(a =>
        a.title.toLowerCase().includes(query.toLowerCase())
      );

      // 🔍 Consultar usuarios
      const userRes = await fetch(`${local_url}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const usuarios = await userRes.json();
      const filtradosUsuarios = usuarios.filter(u =>
        u.name.toLowerCase().includes(query.toLowerCase())
      );

      // 🧱 Renderizar resultados
      results.innerHTML = "";

      filtradosAnimes.forEach(anime => {
        const item = document.createElement("div");
        item.className = "d-flex align-items-center p-2 border-bottom";
        item.innerHTML = `
          <img src="${anime.imgUrl}" style="width: 40px; height: 40px; object-fit: cover; margin-right: 10px; border-radius: 4px;">
          <a href="anime.html?id=${anime._id}" class="text-white text-decoration-none">${anime.title}</a>
        `;
        results.appendChild(item);
      });

      filtradosUsuarios.forEach(user => {
        const item = document.createElement("div");
        item.className = "d-flex align-items-center p-2 border-bottom";
        item.innerHTML = `
          <i class="fas fa-user" style="margin-right: 10px;"></i>
          <a href="perfil.html?id=${user._id}" class="text-white text-decoration-none">${user.name}</a>
        `;
        results.appendChild(item);
      });

      if (results.innerHTML === "") {
        results.innerHTML = `<p class="text-center text-muted">Sin resultados</p>`;
      }

    } catch (err) {
      console.error("Error al buscar:", err);
      results.innerHTML = `<p class="text-danger">Error al buscar</p>`;
    }
  });

  // Cerrar resultados si se hace clic fuera
  document.addEventListener("click", (e) => {
    if (!e.target.closest("#buscar") && !e.target.closest("#resultadosBusqueda")) {
      results.innerHTML = "";
    }
  });
});
