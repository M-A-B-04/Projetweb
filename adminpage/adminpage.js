// Initialisation des données
const data = {};
const entities = {
  clients: ["ID", "Nom", "Email", "Téléphone"],
  commandes: ["ID", "Produit", "Quantité", "Prix", "Statut"],
  produits: ["ID", "Nom", "Catégorie", "Prix", "Stock"],
  factures: ["ID", "Client", "Montant", "Date", "Statut"],
  utilisateurs: ["ID", "Nom d'utilisateur", "Rôle", "Email", "Dernière connexion"],
};

// Fonction pour sauvegarder les données dans LocalStorage
function saveData(entity) {
  localStorage.setItem(entity, JSON.stringify(data[entity]));
}

// Fonction pour charger les données depuis LocalStorage
function loadData(entity) {
  const storedData = localStorage.getItem(entity);
  return storedData ? JSON.parse(storedData) : [];
}

// Fonction pour générer des données réalistes
function generateFakeData() {
    if (!window.faker || !faker.datatype) {
      console.error("Faker.js n'est pas chargé correctement !");
      alert("Erreur : Faker.js n'est pas chargé correctement !");
      return;
    }
  
    // Générer des données réalistes pour les entités
    data.clients = Array.from({ length: 10 }, () => ({
      ID: faker.datatype.uuid(),
      Nom: faker.name.findName(),
      Email: faker.internet.email(),
      Téléphone: faker.phone.phoneNumberFormat(),
    }));
  
    data.commandes = Array.from({ length: 10 }, () => ({
      ID: faker.datatype.uuid(),
      Produit: faker.commerce.productName(),
      Quantité: faker.datatype.number({ min: 1, max: 10 }),
      Prix: faker.commerce.price(10, 100, 2, "€"),
      Statut: faker.helpers.randomize(["En attente", "Livrée", "Annulée"]),
    }));
  
    data.produits = Array.from({ length: 10 }, () => ({
      ID: faker.datatype.uuid(),
      Nom: faker.commerce.productName(),
      Catégorie: faker.commerce.department(),
      Prix: faker.commerce.price(5, 500, 2, "€"),
      Stock: faker.datatype.number({ min: 0, max: 100 }),
    }));
  
    data.factures = Array.from({ length: 10 }, () => ({
      ID: faker.datatype.uuid(),
      Client: faker.name.findName(),
      Montant: faker.commerce.price(50, 1000, 2, "€"),
      Date: faker.date.past(1).toLocaleDateString(),
      Statut: faker.helpers.randomize(["Payée", "En attente", "Annulée"]),
    }));
  
    data.utilisateurs = Array.from({ length: 10 }, () => ({
      ID: faker.datatype.uuid(),
      "Nom d'utilisateur": faker.internet.userName(),
      Rôle: faker.helpers.randomize(["Admin", "Utilisateur", "Modérateur"]),
      Email: faker.internet.email(),
      "Dernière connexion": faker.date.recent().toLocaleString(),
    }));
  
    console.log("Données générées : ", data);
  }
  

// Fonction pour mettre à jour le tableau
function updateTable(entity) {
  if (!data[entity] || data[entity].length === 0) {
    console.error(`Les données pour l'entité "${entity}" sont introuvables ou vides.`);
    return;
  }

  const tableHead = document.getElementById("table-head");
  const tableBody = document.getElementById("table-body");
  const title = document.getElementById("entity-title");
  const searchBar = document.getElementById("search-bar");

  title.textContent = entity.charAt(0).toUpperCase() + entity.slice(1);
  searchBar.placeholder = `Rechercher dans ${entity}...`;

  tableHead.innerHTML = "";
  tableBody.innerHTML = "";

  // Ajouter les en-têtes
  entities[entity].forEach(header => {
    const th = document.createElement("th");
    th.textContent = header;
    tableHead.appendChild(th);
  });

  // Ajouter les en-têtes d'actions
  const actionsTh = document.createElement("th");
  actionsTh.textContent = "Actions";
  tableHead.appendChild(actionsTh);

  // Ajouter les lignes de données
  data[entity].forEach((row, index) => {
    const tr = document.createElement("tr");
    Object.values(row).forEach(value => {
      const td = document.createElement("td");
      td.textContent = value;
      tr.appendChild(td);
    });

    const actionsTd = document.createElement("td");
    const editBtn = document.createElement("button");
    const deleteBtn = document.createElement("button");

    editBtn.textContent = "Éditer";
    deleteBtn.textContent = "Supprimer";

    editBtn.onclick = () => editRow(entity, index);
    deleteBtn.onclick = () => deleteRow(entity, index);

    actionsTd.appendChild(editBtn);
    actionsTd.appendChild(deleteBtn);
    tr.appendChild(actionsTd);

    tableBody.appendChild(tr);
  });
}

// Ajouter une nouvelle entrée
function createRow(entity) {
  const newRow = {};
  entities[entity].forEach(field => {
    const value = prompt(`Entrez la valeur pour ${field}:`);
    if (value) {
      newRow[field] = value;
    }
  });
  if (Object.keys(newRow).length === entities[entity].length) {
    data[entity].push(newRow);
    saveData(entity);
    updateTable(entity);
  }
}

// Éditer une ligne
function editRow(entity, index) {
  const row = data[entity][index];
  Object.keys(row).forEach(key => {
    const newValue = prompt(`Modifier ${key} (actuel: ${row[key]}):`);
    if (newValue) {
      row[key] = newValue;
    }
  });
  saveData(entity);
  updateTable(entity);
}

// Supprimer une ligne
function deleteRow(entity, index) {
  if (confirm("Êtes-vous sûr de vouloir supprimer cette entrée ?")) {
    data[entity].splice(index, 1);
    saveData(entity);
    updateTable(entity);
  }
}

// Fonction de recherche dynamique
function filterData(entity, query) {
  const filtered = data[entity].filter(row =>
    Object.values(row).some(value => value.toLowerCase().includes(query.toLowerCase()))
  );
  return filtered;
}

// Initialisation
function init() {
  generateFakeData();

  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach(item => {
    item.addEventListener("click", (event) => {
      event.preventDefault();
      const entity = event.target.dataset.entity;
      updateTable(entity);
    });
  });

  document.getElementById("search-bar").addEventListener("input", (e) => {
    const entity = document.getElementById("entity-title").textContent.toLowerCase();
    const filteredData = filterData(entity, e.target.value);
    data[entity] = filteredData.length > 0 ? filteredData : loadData(entity);
    updateTable(entity);
  });

  document.getElementById("add-entry-btn").onclick = () => {
    const entity = document.getElementById("entity-title").textContent.toLowerCase();
    createRow(entity);
  };

  updateTable("clients");
}

document.addEventListener("DOMContentLoaded", init);
