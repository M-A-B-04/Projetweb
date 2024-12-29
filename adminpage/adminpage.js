// Déclare et initialise `data` comme un objet vide
const data = {};

// Déclare les colonnes pour chaque entité
const entities = {
  clients: ["ID", "Nom", "Email", "Téléphone"],
  commandes: ["ID", "Produit", "Quantité", "Prix", "Statut"],
  produits: ["ID", "Nom", "Catégorie", "Prix", "Stock"],
  factures: ["ID", "Client", "Montant", "Date", "Statut"],
  utilisateurs: ["ID", "Nom d'utilisateur", "Rôle", "Email", "Dernière connexion"],
};

// Générer des données fictives avec Faker.js
function generateFakeData() {
  const faker = window.faker; // Assurez-vous que Faker.js est chargé avant ce script

  if (!faker || !faker.random) {
    console.error("Faker.js n'est pas chargé correctement !");
    return;
  }

  data.clients = Array.from({ length: 5 }, () => ({
    ID: faker.random.uuid(), // Compatible avec anciennes versions
    Nom: faker.name.findName(),
    Email: faker.internet.email(),
    Téléphone: faker.phone.phoneNumber(),
  }));

  data.commandes = Array.from({ length: 5 }, () => ({
    ID: faker.random.uuid(),
    Produit: faker.commerce.productName(),
    Quantité: faker.random.number({ min: 1, max: 10 }),
    Prix: faker.commerce.price(),
    Statut: faker.random.arrayElement(["En attente", "Livrée", "Annulée"]),
  }));

  data.produits = Array.from({ length: 5 }, () => ({
    ID: faker.random.uuid(),
    Nom: faker.commerce.productName(),
    Catégorie: faker.commerce.department(),
    Prix: faker.commerce.price(),
    Stock: faker.random.number({ min: 0, max: 100 }),
  }));

  data.factures = Array.from({ length: 5 }, () => ({
    ID: faker.random.uuid(),
    Client: faker.name.findName(),
    Montant: faker.commerce.price(),
    Date: faker.date.past().toLocaleDateString(),
    Statut: faker.random.arrayElement(["Payée", "En attente", "Annulée"]),
  }));

  data.utilisateurs = Array.from({ length: 5 }, () => ({
    ID: faker.random.uuid(),
    "Nom d'utilisateur": faker.internet.userName(),
    Rôle: faker.random.arrayElement(["Admin", "Utilisateur", "Modérateur"]),
    Email: faker.internet.email(),
    "Dernière connexion": faker.date.recent().toLocaleString(),
  }));
}

// Met à jour le tableau en fonction de l'entité sélectionnée
function updateTable(entity) {
  const tableHead = document.getElementById("table-head");
  const tableBody = document.getElementById("table-body");
  const title = document.getElementById("entity-title");

  title.textContent = entity.charAt(0).toUpperCase() + entity.slice(1);

  // Effacer le contenu précédent
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

    // Ajouter les boutons d'actions (Éditer, Supprimer)
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
  updateTable(entity);
}

// Supprimer une ligne
function deleteRow(entity, index) {
  if (confirm("Êtes-vous sûr de vouloir supprimer cette entrée ?")) {
    data[entity].splice(index, 1);
    updateTable(entity);
  }
}

// Initialiser l'application
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

  // Charger la première entité par défaut
  updateTable("clients");

  // Ajouter le bouton "Créer"
  const createBtn = document.createElement("button");
  createBtn.textContent = "Ajouter une nouvelle entrée";
  createBtn.onclick = () => createRow("clients");
  document.body.insertBefore(createBtn, document.body.firstChild);
}

document.addEventListener("DOMContentLoaded", init);
