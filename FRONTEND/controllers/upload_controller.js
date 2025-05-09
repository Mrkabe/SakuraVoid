async function uploadAnime(data, file) {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('file', file);

  const res = await fetch(`${API_URL}/animes`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  });

  return await res.json();
}
