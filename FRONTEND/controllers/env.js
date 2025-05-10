const local_url = "http://localhost:3000";

function validateLogin() {
    const pathname = window.location.pathname;
    const isProtectedPage = pathname.includes("perfil.html") ||
                            pathname.includes("upload.html") ||
                            pathname.includes("favoritos.html");

    // Si intenta entrar a páginas protegidas sin sesión
    if ((!sessionStorage.user || !sessionStorage.token) && isProtectedPage) {
        alert("Favor de iniciar sesión");
        window.location.href = local_url + "/login.html";
    }

    // Si ya tiene sesión y está en login o raíz, redirigir a home
    if (sessionStorage.user && (pathname === "/" || pathname.includes("login.html"))) {
        window.location.href = local_url + "/home.html";
    }
}

validateLogin();
