
///WASTE CATEGORIES PAGE JS


 const facts = [
      "Recycling one aluminum can saves enough energy to power a TV for 3 hours.",
      "Plastic bottles take up to 450 years to decompose.",
      "Recycling a ton of paper saves 17 trees and 7,000 gallons of water.",
      "Composting food waste can reduce landfill waste by up to 30%.",
      "Glass is 100% recyclable and can be reused endlessly without loss of quality.",
      "E-waste contains valuable metals like gold and silver that can be reused.",
      "Recycling food waste into biogas can produce renewable energy.",
      "Producing recycled paper uses 60% less energy than making paper from wood pulp.",
      "Only 12% of clothing thrown away is recycled.",
      "Recycling a single ink cartridge keeps 2.5 pounds of metal and plastic out of landfills.",
      "Organic waste makes up 50% of landfill content in developing countries.",
      "Paper can be recycled up to seven times before its fibers become too short.",
      "Over 90% of ocean plastic comes from rivers in Asia and Africa.",
      "A single computer monitor can contain up to 8 pounds of lead.",
      "Every ton of recycled glass saves over 300 kilograms of carbon dioxide.",
      "Food waste is responsible for 8% of global greenhouse gas emissions.",
      "Producing recycled steel uses 60% less energy compared to new steel.",
      "More than 1 billion tires are discarded worldwide every year.",
      "Burning plastic releases toxic chemicals like dioxins and furans.",
      "Recycling one ton of plastic saves 7.4 cubic yards of landfill space.",
      "Using recycled materials in manufacturing saves water compared to using raw resources.",
      "Without recycling, global waste is expected to increase by 70% by 2050.",
      "Repairing and reusing items reduces waste more efficiently than recycling."
        ];

    function showRandomFact() {
      const randomIndex = Math.floor(Math.random() * facts.length);
      document.getElementById("fact-box").textContent = facts[randomIndex];
    }

    window.addEventListener("DOMContentLoaded", showRandomFact);





/////////RECYCLE PAGE JS

/////LocalStorage keys
const STORAGE_KEY = "recycling_logs";
const BADGES_KEY = "recycling_badges";


const form = document.getElementById("recycleForm");
const categoryInput = document.getElementById("category");
const quantityInput = document.getElementById("quantity");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const tableBody = document.querySelector("#logsTable tbody");
const progressBars = document.getElementById("progressBars");
const badgeAlert = document.getElementById("badgeAlert");

let logs = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let badges = JSON.parse(localStorage.getItem(BADGES_KEY)) || {};

function saveLogs() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

function saveBadges() {
  localStorage.setItem(BADGES_KEY, JSON.stringify(badges));
}

///////Badge notification
function showBadge(category) {
  if (!badges[category]) {
    badges[category] = true;
    saveBadges();

    badgeAlert.textContent = `🎉 Recycler Badge Earned for ${category}!`;
    badgeAlert.classList.remove("d-none");

    setTimeout(() => badgeAlert.classList.add("d-none"), 3000);
  }
}

// ===== Render Table =====
function renderLogs() {
  tableBody.innerHTML = "";

  let filtered = logs.filter(
    log =>
      log.category.toLowerCase().includes(searchInput.value.toLowerCase()) ||
      log.quantity.toString().includes(searchInput.value)
  );

  if (sortSelect.value === "category") {
    filtered.sort((a, b) => a.category.localeCompare(b.category));
  } else if (sortSelect.value === "quantity") {
    filtered.sort((a, b) => b.quantity - a.quantity);
  }

  filtered.forEach((log, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${log.category}</td>
      <td>${log.quantity}</td>
      <td>
        <button class="btn btn-sm btn-warning" onclick="editLog(${index})">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteLog(${index})">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  renderProgress();
}

//////Render bar progress
function renderProgress() {
  progressBars.innerHTML = "";

  const totals = logs.reduce((acc, log) => {
    acc[log.category] = (acc[log.category] || 0) + log.quantity;
    return acc;
  }, {});

  Object.keys(totals).forEach(category => {
    const percent = Math.min(totals[category] * 10, 100);

    const bar = `
      <div class="mb-3 text-primary">
        <strong>${category}:</strong> ${totals[category]} items
        <div class="progress">
          <div class="progress-bar bg-primary" style="width: ${percent}%" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100">${percent}%</div>
        </div>
      </div>
    `;
    progressBars.innerHTML += bar;

    if (totals[category] > 10) showBadge(category);
  });
}

///////Add entry
form.addEventListener("submit", e => {
  e.preventDefault();

  const category = categoryInput.value;
  const quantity = parseInt(quantityInput.value);

  if (!category || !quantity || quantity <= 0) return alert("Enter valid data");

  logs.push({ category, quantity });
  saveLogs();
  renderLogs();

  form.reset();
});

////Edit entry
window.editLog = function (index) {
  const newQty = parseInt(prompt("Enter new quantity:", logs[index].quantity));
  if (!isNaN(newQty) && newQty > 0) {
    if (confirm("Save edit?")) {
        logs[index].quantity = newQty;
        saveLogs();
        renderLogs();
    }
  }
};

////Delete entry 
window.deleteLog = function (index) {
  if (confirm("Delete this entry?")) {
    logs.splice(index, 1);
    saveLogs();
    renderLogs();
  }
};

///////Search and sort
searchInput.addEventListener("input", renderLogs);
sortSelect.addEventListener("change", renderLogs);

/////Initialize on load
renderLogs();
