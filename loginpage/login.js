document.getElementById("loginForm").addEventListener("submit", function (event) {
  event.preventDefault(); // Empêche le rechargement de la page

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  const adminCredentials = {
    username: "admin",
    password: "admin",
  };

  // Vérifie si les champs sont vides
  if (username === "" || password === "") {
    document.getElementById("errorMessage").textContent = "Veuillez remplir tous les champs.";
    return;
  }

  // Vérifie les identifiants
  if (username === adminCredentials.username && password === adminCredentials.password) {
    document.getElementById("errorMessage").textContent = ""; // Efface les messages d'erreur
    window.location.href = "../adminpage/adminpage.html";
  } else {
    document.getElementById("errorMessage").textContent = "Nom d'utilisateur ou mot de passe incorrect !";
  }
});
