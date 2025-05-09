async function getUserWithFavorites() {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const res = await fetch(`${API_URL}/users/${user.id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return await res.json();
}
