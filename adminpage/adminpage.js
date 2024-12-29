// Fake data generator using Faker.js
const entities = {
    clients: ["ID", "Nom", "Email", "Téléphone"],
    commandes: ["ID", "Produit", "Quantité", "Prix", "Statut"],
    produits: ["ID", "Nom", "Catégorie", "Prix", "Stock"],
    factures: ["ID", "Client", "Montant", "Date", "Statut"],
    utilisateurs: ["ID", "Nom d'utilisateur", "Rôle", "Email", "Dernière connexion"]
  };
  
  const data = {};
  
// Générer des données fictives avec compatibilité ancienne version Faker.js
function generateFakeData() {
    const faker = window.faker;
  
    data.clients = Array.from({ length: 10 }, () => ({
      ID: faker.random.uuid(),
      Nom: faker.name.findName(),
      Email: faker.internet.email(),
      Téléphone: faker.phone.phoneNumber(),
    }));
  
    data.commandes = Array.from({ length: 10 }, () => ({
      ID: faker.random.uuid(),
      Produit: faker.commerce.productName(),
      Quantité: faker.random.number({ min: 1, max: 10 }),
      Prix: faker.commerce.price(),
      Statut: faker.random.arrayElement(["En attente", "Livrée", "Annulée"]),
    }));
  
    data.produits = Array.from({ length: 10 }, () => ({
      ID: faker.random.uuid(),
      Nom: faker.commerce.productName(),
      Catégorie: faker.commerce.department(),
      Prix: faker.commerce.price(),
      Stock: faker.random.number({ min: 0, max: 100 }),
    }));
  
    data.factures = Array.from({ length: 10 }, () => ({
      ID: faker.random.uuid(),
      Client: faker.name.findName(),
      Montant: faker.commerce.price(),
      Date: faker.date.past().toLocaleDateString(),
      Statut: faker.random.arrayElement(["Payée", "En attente", "Annulée"]),
    }));
  
    data.utilisateurs = Array.from({ length: 10 }, () => ({
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
  
    // Ajouter les lignes de données
    data[entity].forEach(row => {
      const tr = document.createElement("tr");
      Object.values(row).forEach(value => {
        const td = document.createElement("td");
        td.textContent = value;
        tr.appendChild(td);
      });
      tableBody.appendChild(tr);
    });
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
  }
  
  document.addEventListener("DOMContentLoaded", init);
  