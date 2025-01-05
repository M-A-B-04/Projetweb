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

// Réinitialiser les données
function resetData() {
  Object.keys(entities).forEach(entity => {
    localStorage.removeItem(entity); // Supprime les données sauvegardées
    data[entity] = []; // Vide les données en mémoire
  });
  alert("Les données ont été réinitialisées !");
  generateFakeData(); // Regénère des données fictives
  updateTable("clients"); // Recharge la table par défaut
}

// Générer des données fictives avec Faker.js
function generateFakeData() {
  if (!window.faker) {
    console.error("Faker.js n'est pas chargé correctement !");
    return;
  }

  Object.keys(entities).forEach(entity => {
    data[entity] = loadData(entity);

    if (!data[entity] || data[entity].length === 0) {
      switch (entity) {
        case "clients":
          data[entity] = Array.from({ length: 10 }, () => ({
            ID: faker.random.uuid(),
            Nom: faker.name.findName(),
            Email: faker.internet.email(),
            Téléphone: faker.phone.phoneNumber(),
          }));
          break;

        case "commandes":
          data[entity] = Array.from({ length: 10 }, () => ({
            ID: faker.random.uuid(),
            Produit: faker.commerce.productName(),
            Quantité: faker.random.number({ min: 1, max: 10 }),
            Prix: faker.commerce.price(),
            Statut: faker.random.arrayElement(["En attente", "Livrée", "Annulée"]),
          }));
          break;

        case "produits":
          data[entity] = Array.from({ length: 10 }, () => ({
            ID: faker.random.uuid(),
            Nom: faker.commerce.productName(),
            Catégorie: faker.commerce.department(),
            Prix: faker.commerce.price(),
            Stock: faker.random.number({ min: 0, max: 100 }),
          }));
          break;

        case "factures":
          data[entity] = Array.from({ length: 10 }, () => ({
            ID: faker.random.uuid(),
            Client: faker.name.findName(),
            Montant: faker.commerce.price(),
            Date: faker.date.past().toLocaleDateString(),
            Statut: faker.random.arrayElement(["Payée", "En attente", "Annulée"]),
          }));
          break;

        case "utilisateurs":
          data[entity] = Array.from({ length: 10 }, () => ({
            ID: faker.random.uuid(),
            "Nom d'utilisateur": faker.internet.userName(),
            Rôle: faker.random.arrayElement(["Admin", "Utilisateur", "Modérateur"]),
            Email: faker.internet.email(),
            "Dernière connexion": faker.date.recent().toLocaleString(),
          }));
          break;

        default:
          console.error(`Entité inconnue : ${entity}`);
          break;
      }
      saveData(entity);
    }
  });

  console.log("Données générées :", data);
}

// Mettre à jour le tableau
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

  // Add headers with consistent width
  entities[entity].forEach(header => {
    const th = document.createElement("th");
    th.textContent = header;
    th.style.width = header === "ID" ? "100px" : "auto"; // Fixed width for ID column
    tableHead.appendChild(th);
  });

  // Add actions header
  const actionsTh = document.createElement("th");
  actionsTh.textContent = "Actions";
  actionsTh.style.width = "150px"; // Fixed width for actions column
  tableHead.appendChild(actionsTh);

  // Add data rows
  data[entity].forEach((row, index) => {
    const tr = document.createElement("tr");
    
    // Add data cells
    Object.values(row).forEach(value => {
      const td = document.createElement("td");
      td.textContent = value;
      tr.appendChild(td);
    });

    // Add action buttons
    const actionsTd = document.createElement("td");
    actionsTd.style.width = "150px"; // Match header width
    
    const editBtn = document.createElement("button");
    const deleteBtn = document.createElement("button");

    editBtn.innerHTML = '<i class="fas fa-edit"></i> Éditer';
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i> Supprimer';

    editBtn.onclick = () => editRow(entity, index);
    deleteBtn.onclick = () => deleteRow(entity, index);

    actionsTd.appendChild(editBtn);
    actionsTd.appendChild(deleteBtn);
    tr.appendChild(actionsTd);

    tableBody.appendChild(tr);
  });
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

// Barre de recherche dynamique
function filterData(entity, query) {
  if (!query.trim()) {
    data[entity] = loadData(entity);
    updateTable(entity);
    return;
  }

  const filtered = loadData(entity).filter(row =>
    Object.values(row).some(value =>
      value.toLowerCase().includes(query.toLowerCase())
    )
  );

  data[entity] = filtered;
  updateTable(entity);
}

// Add this function to handle new entry creation
function createRow(entity) {
    const newEntry = {};
    
    // Get field names for the current entity
    const fields = entities[entity];
    
    // Ask for each field value
    fields.forEach(field => {
        let value = prompt(`Entrez ${field}:`);
        if (field === "ID") {
            value = faker.random.uuid(); // Generate UUID for ID field
        }
        newEntry[field] = value || ''; // Use empty string if no value provided
    });
    
    // Add the new entry only if at least one field has a value
    if (Object.values(newEntry).some(value => value !== '')) {
        data[entity].push(newEntry);
        saveData(entity);
        updateTable(entity);
    }
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
    filterData(entity, e.target.value);
  });

  document.getElementById("add-entry-btn").onclick = () => {
    const entity = document.getElementById("entity-title").textContent.toLowerCase();
    createRow(entity);
  };

  document.getElementById("reset-data-btn").onclick = resetData;

  updateTable("clients");
}

document.addEventListener("DOMContentLoaded", init);
