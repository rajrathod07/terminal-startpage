/* =========================================
   1. CORE STATE & DEFAULTS
   ========================================= */
const defaultSettings = {
  firstRun: true,
  userName: "Raj",
  userRole: "Hacker • Coder • Security",
  promptLabel: "raj@terminal:~$",
  inputPlaceholder: "Type alias or URL...",
  theme: "mesh",
  themeColor: "#00ff9c",
  aliases: {
    yt: "https://youtube.com",
    gh: "https://github.com",
    gpt: "https://chat.openai.com",
    gg: "https://google.com",
    rd: "https://reddit.com",
    loc: "http://localhost:8080",
    thm: "https://tryhackme.com"
  },
  quickLinks: [
    { name: "YouTube", url: "https://youtube.com" },
    { name: "ChatGPT", url: "https://chat.openai.com" },
    { name: "GitHub", url: "https://github.com" }
  ]
};

const hardcodedCommands = [
  { key: "config", desc: "Open System Settings" },
  { key: "ls -a", desc: "Show All Aliases" },
  { key: "sudo", desc: "Grant Root Access" },
  { key: "matrix", desc: "Matrix Rain Effect" },
  { key: "hack", desc: "Advanced Hacking Sim" },
  { key: "help", desc: "List Commands" },
  { key: "party", desc: "Toggle Party Mode" },
  { key: "404", desc: "Glitch System Error" }
];

let settings = JSON.parse(localStorage.getItem("terminalConfig")) || defaultSettings;
if(!settings.quickLinks) settings.quickLinks = defaultSettings.quickLinks;
if(!settings.themeColor) settings.themeColor = defaultSettings.themeColor;
if(settings.firstRun === undefined) settings.firstRun = true;

/* =========================================
   2. DOM ELEMENTS
   ========================================= */
const cmd = document.getElementById("cmd");
const suggest = document.getElementById("suggest");
const userNameDisplay = document.getElementById("userNameDisplay");
const roleText = document.getElementById("roleText");
const promptLabel = document.getElementById("promptLabel");
const greetElement = document.getElementById("greet");
const favGrid = document.getElementById("favGrid");
const favEditBtn = document.getElementById("favEditBtn");
const favTitle = document.getElementById("favTitle");
const mainCard = document.getElementById("mainCard"); // Defined once here

// Config
const configOverlay = document.getElementById("configOverlay");
const closeConfigBtn = document.getElementById("closeConfigBtn");
const saveConfigBtn = document.getElementById("saveConfigBtn");
const addAliasBtn = document.getElementById("addAliasBtn");
const configAliasList = document.getElementById("configAliasList");
const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const importFile = document.getElementById("importFile");
const resetBtn = document.getElementById("resetBtn");
const confBg = document.getElementById("confBg");
const confColor = document.getElementById("confColor");
const aliasSearch = document.getElementById("aliasSearch");
const newAliasKey = document.getElementById("newAliasKey");
const newAliasUrl = document.getElementById("newAliasUrl");
const editOriginalKey = document.getElementById("editOriginalKey");

// Overlays & Alerts
const customModal = document.getElementById("customModal");
const modalTitle = document.getElementById("modalTitle");
const modalMsg = document.getElementById("modalMsg");
const modalFooter = document.getElementById("modalFooter");
const introOverlay = document.getElementById("introOverlay");
const introLog = document.getElementById("introLog");
const introFooter = document.getElementById("introFooter");
const skipIntroBtn = document.getElementById("skipIntroBtn");
const rootOverlay = document.getElementById("rootOverlay");
const glitchOverlay = document.getElementById("glitchOverlay");

// Root Animations
const rootText = document.getElementById("rootText");
const rootCodes = document.getElementById("rootCodes");

// List Overlay
const listOverlay = document.getElementById("listOverlay");
const overlaySearch = document.getElementById("overlaySearch");
const overlayGrid = document.getElementById("aliasGrid");

// Cursor
const cursorDot = document.getElementById("cursor-dot");
const cursorRing = document.getElementById("cursor-ring");

let isEditingFavs = false;

/* =========================================
   3. INITIALIZATION
   ========================================= */
function init() {
  if (settings.firstRun) runBiosIntro();
  else introOverlay.style.display = "none";
  
  applyVisuals();
  renderQuickLinks();
  updateGreeting();
  cmd.focus();
}

/* --- BIOS INTRO --- */
function runBiosIntro() {
  const lines = [
    "BIOS DATE 01/16/26 18:36:18 VER 1.0.0",
    "INITIALIZING KERNEL...",
    "LOADING USER PROFILE...",
    "MOUNTING FILE SYSTEM...",
    "CHECKING PERMISSIONS...",
    "ESTABLISHING SECURE CONNECTION...",
    "ACCESS GRANTED."
  ];

  let lineIndex = 0;
  function typeLine() {
    if (lineIndex >= lines.length) {
      introFooter.innerHTML = "SYSTEM READY // <span style='color:var(--green)'>CREATED BY RAJ</span>";
      skipIntroBtn.classList.remove("hidden");
      skipIntroBtn.classList.add("visible");
      return;
    }
    const div = document.createElement("div");
    div.textContent = "> " + lines[lineIndex];
    div.style.opacity = 0;
    introLog.appendChild(div);
    setTimeout(() => { div.style.opacity = 1; }, 50);
    lineIndex++;
    setTimeout(typeLine, 500);
  }
  setTimeout(typeLine, 500);
}

skipIntroBtn.addEventListener("click", () => {
  introOverlay.style.opacity = "0";
  setTimeout(() => {
    introOverlay.style.display = "none";
    settings.firstRun = false;
    saveSettingsLocally();
    cmd.focus();
  }, 1000);
});

/* --- MODAL SYSTEM --- */
function showModal(title, msg) {
  modalTitle.textContent = title;
  modalMsg.innerHTML = msg.replace(/\n/g, "<br>");
  modalFooter.innerHTML = `<button class="btn-ui btn-primary" onclick="closeModal()">ACKNOWLEDGE</button>`;
  customModal.style.display = "flex";
}

function showConfirm(title, msg, onYes) {
  modalTitle.textContent = title;
  modalMsg.innerHTML = msg.replace(/\n/g, "<br>");
  modalFooter.innerHTML = "";
  
  const btnYes = document.createElement("button");
  btnYes.className = "btn-ui btn-danger";
  btnYes.textContent = "YES";
  btnYes.onclick = () => { closeModal(); onYes(); };
  
  const btnNo = document.createElement("button");
  btnNo.className = "btn-ui btn-secondary";
  btnNo.textContent = "NO";
  btnNo.onclick = closeModal;
  
  modalFooter.appendChild(btnNo);
  modalFooter.appendChild(btnYes);
  
  customModal.style.display = "flex";
}

window.closeModal = function() {
  customModal.style.display = "none";
  cmd.focus();
};

function applyVisuals() {
  userNameDisplay.textContent = settings.userName;
  roleText.textContent = settings.userRole;
  promptLabel.textContent = settings.promptLabel;
  cmd.placeholder = settings.inputPlaceholder;
  document.documentElement.style.setProperty('--green', settings.themeColor);
  document.documentElement.style.setProperty('--green-dim', settings.themeColor + '33');
  applyBgTheme(settings.theme);
}

function updateGreeting() {
  const h = new Date().getHours();
  let timeTxt = h < 12 ? "Good Morning" : h < 17 ? "Good Afternoon" : h < 21 ? "Good Evening" : "Good Night";
  greetElement.textContent = `${timeTxt}, ${settings.userName}`;
}

function tick() {
  const d = new Date();
  document.getElementById("time").textContent = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  document.getElementById("date").textContent = d.toDateString();
}
setInterval(tick, 1000);
tick();

/* =========================================
   4. THEME & COMMAND LOGIC
   ========================================= */
function applyBgTheme(themeName) {
  const body = document.body;
  if(themeName === "matrix") {
    body.classList.add("bg-matrix");
    startMatrix();
  } else {
    body.classList.remove("bg-matrix");
    stopMatrix();
  }
}
window.setThemeColor = function(color) { confColor.value = color; };
window.switchTab = function(tabId) {
  document.querySelectorAll('.config-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.sidebar-nav li').forEach(l => l.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  const tabs = ['tab-identity', 'tab-theme', 'tab-aliases', 'tab-eggs', 'tab-data'];
  document.querySelectorAll('.sidebar-nav li')[tabs.indexOf(tabId)].classList.add('active');
};

/* =========================================
   5. QUICK LINKS
   ========================================= */
function renderQuickLinks() {
  favGrid.innerHTML = "";
  settings.quickLinks.forEach((link, index) => {
    const card = document.createElement("div");
    card.className = "fav-card";
    const iconUrl = `https://www.google.com/s2/favicons?domain=${link.url}&sz=64`;
    card.innerHTML = `
      <img src="${iconUrl}" class="fav-icon-img" alt="icon" onerror="this.style.display='none'">
      <div class="fav-label">${link.name}</div>
      <div class="card-overlay">
        <div class="mini-btn" onclick="editQuickLink(${index})">✎</div>
        <div class="mini-btn del" onclick="deleteQuickLink(${index})">✖</div>
      </div>
    `;
    card.onclick = (e) => {
      if(!isEditingFavs && !e.target.closest('.mini-btn')) window.open(link.url, "_self");
    };
    favGrid.appendChild(card);
  });
  if(settings.quickLinks.length < 8) {
    const addCard = document.createElement("div");
    addCard.className = "fav-card add-new";
    addCard.innerHTML = `<div class="add-plus">+</div>`;
    addCard.onclick = () => addNewQuickLink();
    favGrid.appendChild(addCard);
  }
}

favEditBtn.addEventListener("click", () => {
  isEditingFavs = !isEditingFavs;
  document.body.classList.toggle("editing-favs", isEditingFavs);
  favEditBtn.classList.toggle("active", isEditingFavs);
  if(isEditingFavs) {
    favTitle.textContent = "/// EDIT MODE ACTIVE ///";
    favTitle.classList.add("blink-warning");
  } else {
    favTitle.textContent = "QUICK ACCESS";
    favTitle.classList.remove("blink-warning");
  }
});

function addNewQuickLink() {
  const name = prompt("Shortcut Name:");
  if(!name) return;
  const url = prompt("Shortcut URL:");
  if(!url) return;
  settings.quickLinks.push({ name, url });
  saveSettingsLocally();
  renderQuickLinks();
}
window.editQuickLink = function(index) {
  const link = settings.quickLinks[index];
  const newName = prompt("Edit Name:", link.name);
  if(!newName) return;
  const newUrl = prompt("Edit URL:", link.url);
  if(!newUrl) return;
  settings.quickLinks[index] = { name: newName, url: newUrl };
  saveSettingsLocally();
  renderQuickLinks();
};

window.deleteQuickLink = function(index) {
  showConfirm("DELETE SHORTCUT", "Remove this link?", () => {
    settings.quickLinks.splice(index, 1);
    saveSettingsLocally();
    renderQuickLinks();
  });
};

/* =========================================
   6. COMMANDS & SUGGESTIONS
   ========================================= */
let matches = [];
let selectedIndex = 0;

cmd.addEventListener("input", () => {
  const v = cmd.value.toLowerCase();
  suggest.innerHTML = ""; matches = []; selectedIndex = 0;
  
  if (!v) { suggest.style.display = "none"; return; }
  
  const sysMatches = hardcodedCommands.filter(c => c.key.startsWith(v));
  sysMatches.forEach(c => matches.push({ key: c.key, desc: c.desc, type: 'sys' }));
  
  const aliasMatches = Object.keys(settings.aliases).filter(k => k.includes(v));
  aliasMatches.forEach(k => matches.push({ key: k, desc: settings.aliases[k], type: 'alias' }));

  if(matches.length > 0) {
    matches.forEach((m, i) => {
      const d = document.createElement("div");
      d.innerHTML = `<span>${m.key}</span><span class="cmd-desc">${m.desc}</span>`;
      if (i === 0) d.classList.add("active");
      d.onclick = () => {
        if(m.type === 'sys') checkCommand(m.key);
        else openLink(m.key);
      };
      suggest.appendChild(d);
    });
    suggest.style.display = "block";
  } else {
    suggest.style.display = "none";
  }
});

cmd.addEventListener("keydown", (e) => {
  if (e.key === "Tab" && matches.length) {
    e.preventDefault();
    cmd.value = matches[selectedIndex].key;
    updateSelection();
  }
  if (e.key === "ArrowDown") {
    e.preventDefault();
    if (matches.length) selectedIndex = (selectedIndex + 1) % matches.length;
    updateSelection();
  }
  if (e.key === "ArrowUp") {
    e.preventDefault();
    if (matches.length) selectedIndex = (selectedIndex - 1 + matches.length) % matches.length;
    updateSelection();
  }
  if (e.key === "Enter") {
    if (matches.length && suggest.style.display !== "none") {
      const m = matches[selectedIndex];
      if(m.type === 'sys') checkCommand(m.key);
      else openLink(m.key);
    } else {
      checkCommand(cmd.value);
    }
  }
});

function updateSelection() {
  Array.from(suggest.children).forEach((el, i) => {
    const isActive = i === selectedIndex;
    el.classList.toggle("active", isActive);
    if (isActive) el.scrollIntoView({ block: "nearest" });
  });
}

function checkCommand(v) {
  v = v.trim().toLowerCase();
  suggest.style.display = "none";
  
  if (v === "config") { openConfig(); cmd.value = ""; return; }
  if (v === "ls -a") { openListOverlay(); cmd.value = ""; return; }
  if (v === "help") { showModal("COMMANDS", "config, ls -a, sudo, matrix, hack, party, 404"); cmd.value = ""; return; }
  
  // EASTER EGGS
  if (v === "sudo") { activateRootMode(); cmd.value = ""; return; }
  if (v === "404") { activate404(); cmd.value = ""; return; }
  if (v === "matrix") { settings.theme = "matrix"; applyBgTheme("matrix"); saveSettingsLocally(); cmd.value = ""; return; }
  if (v === "hack") { startHack(); cmd.value = ""; return; }
  if (v === "party") { document.body.classList.toggle("party-mode"); cmd.value = ""; return; }
  
  openLink(v);
}

// 404 CRASH ANIMATION
function activate404() {
  mainCard.classList.add("container-glitch");
  setTimeout(() => {
    mainCard.classList.remove("container-glitch");
    const crashOverlay = document.getElementById("crashOverlay");
    crashOverlay.classList.add("active");
    setTimeout(() => {
      crashOverlay.classList.remove("active");
    }, 3000);
  }, 1500);
}

// SUDO ANIMATION
function activateRootMode() {
  rootOverlay.classList.add("active");
  rootText.textContent = "INITIALIZING...";
  rootCodes.innerHTML = "";
  
  let i = 0;
  let interval = setInterval(() => {
    rootCodes.innerHTML += Math.random().toString(16).substring(2, 15) + " ";
    i++;
    if(i > 10) rootText.textContent = "BYPASSING FIREWALL...";
    if(i > 20) rootText.textContent = "OVERRIDING SECURITY...";
    if(i > 30) {
      clearInterval(interval);
      rootText.textContent = "ACCESS GRANTED";
      setTimeout(() => {
        document.body.classList.add("root-mode");
        roleText.textContent = "ROOT // SYSTEM ADMINISTRATOR";
        roleText.style.color = "#fff";
        promptLabel.textContent = "root@system:~#";
        rootOverlay.classList.remove("active");
      }, 500);
    }
  }, 100);
}

function openLink(v) {
  suggest.style.display = "none";
  if (settings.aliases[v]) window.open(settings.aliases[v], "_self");
  else if (v.startsWith("http")) window.open(v, "_self");
  else if (v.includes(".")) window.open("https://" + v, "_self");
  else if (v) window.open("https://duckduckgo.com/search?q=" + v, "_self");
}

/* =========================================
   7. CONFIG LOGIC
   ========================================= */
function openConfig() {
  configOverlay.style.display = "flex";
  document.getElementById("confName").value = settings.userName;
  document.getElementById("confRole").value = settings.userRole;
  document.getElementById("confPrompt").value = settings.promptLabel;
  document.getElementById("confPlace").value = settings.inputPlaceholder;
  confBg.value = settings.theme;
  confColor.value = settings.themeColor;
  resetAliasInputs();
  renderConfigAliases();
}
function closeConfig() { configOverlay.style.display = "none"; cmd.focus(); }

function renderConfigAliases(filter = "") {
  configAliasList.innerHTML = "";
  let keys = Object.keys(settings.aliases).sort();
  if(filter) keys = keys.filter(k => k.includes(filter) || settings.aliases[k].includes(filter));

  keys.forEach(key => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="color:var(--green); font-weight:bold;">${key}</td>
      <td style="opacity:0.7;">${settings.aliases[key]}</td>
      <td style="text-align:right;">
        <button class="btn-edit-alias" onclick="prepareEditAlias('${key}')">EDIT</button>
        <button class="btn-del-alias" onclick="removeAlias('${key}')">DELETE</button>
      </td>
    `;
    configAliasList.appendChild(tr);
  });
}

aliasSearch.addEventListener("input", (e) => renderConfigAliases(e.target.value.toLowerCase()));

addAliasBtn.addEventListener("click", () => {
  const key = newAliasKey.value.trim().toLowerCase();
  const url = newAliasUrl.value.trim();
  const originalKey = editOriginalKey.value;
  
  if (!key || !url) { showModal("ERROR", "Key and URL are required."); return; }
  if (!originalKey && settings.aliases[key]) { showModal("ERROR", `Alias '${key}' already exists!`); return; }
  if (originalKey && key !== originalKey && settings.aliases[key]) { showModal("ERROR", `Alias '${key}' already exists!`); return; }

  if (originalKey) delete settings.aliases[originalKey];
  settings.aliases[key] = url;
  resetAliasInputs();
  renderConfigAliases();
});

window.prepareEditAlias = function(key) {
  newAliasKey.value = key;
  newAliasUrl.value = settings.aliases[key];
  editOriginalKey.value = key;
  addAliasBtn.textContent = "UPDATE";
  addAliasBtn.classList.add("update-mode");
  newAliasKey.focus();
};
function resetAliasInputs() {
  newAliasKey.value = "";
  newAliasUrl.value = "";
  editOriginalKey.value = "";
  addAliasBtn.textContent = "ADD";
  addAliasBtn.classList.remove("update-mode");
}
window.removeAlias = function(key) {
  showConfirm("DELETE ALIAS", `Are you sure you want to delete '${key}'?`, () => {
    delete settings.aliases[key];
    renderConfigAliases(aliasSearch.value.toLowerCase());
  });
};

saveConfigBtn.addEventListener("click", () => {
  settings.userName = document.getElementById("confName").value || "User";
  settings.userRole = document.getElementById("confRole").value || "Role";
  settings.promptLabel = document.getElementById("confPrompt").value || "$";
  settings.inputPlaceholder = document.getElementById("confPlace").value || "...";
  settings.theme = confBg.value;
  settings.themeColor = confColor.value;
  saveSettingsLocally();
  location.reload();
});

function saveSettingsLocally() {
  localStorage.setItem("terminalConfig", JSON.stringify(settings));
}
closeConfigBtn.addEventListener("click", closeConfig);

exportBtn.addEventListener("click", () => {
  const data = JSON.stringify(settings, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "terminal-backup.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

importBtn.addEventListener("click", () => importFile.click());
importFile.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const parsed = JSON.parse(event.target.result);
      if (parsed.userName) {
        localStorage.setItem("terminalConfig", JSON.stringify(parsed));
        showModal("SUCCESS", "Backup restored successfully. Rebooting...");
        setTimeout(() => location.reload(), 1500);
      }
    } catch { showModal("ERROR", "Invalid Backup File"); }
  };
  reader.readAsText(file);
});

resetBtn.addEventListener("click", () => {
  showConfirm("FACTORY RESET", "This will wipe all data. Are you sure?", () => {
    localStorage.removeItem("terminalConfig");
    location.reload();
  });
});

/* =========================================
   8. VISUALS & TOOLS
   ========================================= */
const matrixCanvas = document.getElementById("matrix-canvas");
const ctx = matrixCanvas.getContext("2d");
let matrixInterval;
function resizeMatrix() { matrixCanvas.width = window.innerWidth; matrixCanvas.height = window.innerHeight; }
window.addEventListener("resize", resizeMatrix); resizeMatrix();
const chars = "010101 HACK CODE SYSTEM ROOT";
const charArr = chars.split("");
const fontSize = 14;
let columns = matrixCanvas.width / fontSize;
let drops = [];

function startMatrix() {
  if (matrixInterval) return;
  columns = matrixCanvas.width / fontSize;
  drops = [];
  for(let i=0; i<columns; i++) drops[i] = 1;
  matrixInterval = setInterval(() => {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue("--green");
    ctx.font = fontSize + "px monospace";
    for(let i=0; i<drops.length; i++) {
      const text = charArr[Math.floor(Math.random() * charArr.length)];
      ctx.fillText(text, i*fontSize, drops[i]*fontSize);
      if(drops[i]*fontSize > matrixCanvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }, 50);
}
function stopMatrix() {
  clearInterval(matrixInterval);
  matrixInterval = null;
  ctx.clearRect(0, 0, matrixCanvas.width, matrixCanvas.height);
}

function startHack() {
  const overlay = document.getElementById("hackOverlay");
  const log = document.getElementById("hackLog");
  const msg = document.getElementById("hackMsg");
  overlay.style.display = "flex"; log.innerHTML = ""; msg.style.display = "none";
  
  const hackText = [
    "Initializing Brute Force Attack...",
    "Bypassing Firewall...",
    "Injecting SQL Payload...",
    "Accessing Mainframe Database...",
    "Decrypting User Passwords...",
    "Downloading Sensitive Data...",
    "Covering Tracks...",
    "Deleting System Logs..."
  ];
  let i = 0;
  let interval = setInterval(() => {
    const randHex = Math.random().toString(16).substr(2, 8).toUpperCase();
    log.innerHTML += `[${randHex}] ${hackText[i % hackText.length]}\n`;
    log.scrollTop = log.scrollHeight;
    i++;
    if(i > 25) { 
      clearInterval(interval); 
      msg.style.display="block"; 
      setTimeout(()=>overlay.style.display="none", 2000); 
    }
  }, 100);
}

function openListOverlay() {
  renderOverlayList();
  listOverlay.style.display = "flex";
  overlaySearch.focus();
}

function renderOverlayList(filter = "") {
  overlayGrid.innerHTML = "";
  let keys = Object.keys(settings.aliases).sort();
  if(filter) {
    keys = keys.filter(k => k.includes(filter) || settings.aliases[k].includes(filter));
  }
  keys.forEach(k => {
    const d = document.createElement("div");
    d.className = "alias-item";
    d.innerHTML = `<span class="alias-key">${k}</span><span class="alias-url">${settings.aliases[k]}</span>`;
    d.onclick = () => { openLink(k); listOverlay.style.display="none"; };
    overlayGrid.appendChild(d);
  });
}

overlaySearch.addEventListener("input", (e) => {
  renderOverlayList(e.target.value.toLowerCase());
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    configOverlay.style.display = "none";
    listOverlay.style.display = "none";
    customModal.style.display = "none";
    cmd.focus();
  }
});

/* CURSOR LOGIC */
let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursorDot.style.left = mouseX + "px"; cursorDot.style.top = mouseY + "px";
});
function animateCursor() {
  cursorX += (mouseX - cursorX) * 0.15;
  cursorY += (mouseY - cursorY) * 0.15;
  cursorRing.style.left = cursorX + "px"; cursorRing.style.top = cursorY + "px";
  requestAnimationFrame(animateCursor);
}
animateCursor();

const handleHoverEnter = () => document.body.classList.add("hover-active");
const handleHoverLeave = () => document.body.classList.remove("hover-active");
function attachHover(elements) {
  elements.forEach(el => {
    el.addEventListener("mouseenter", handleHoverEnter);
    el.addEventListener("mouseleave", handleHoverLeave);
  });
}
attachHover(document.querySelectorAll("a, input, button, .close-btn, .fav-edit-icon"));
mainCard.addEventListener("mouseenter", () => document.body.classList.add("focus-mode"));
mainCard.addEventListener("mouseleave", () => document.body.classList.remove("focus-mode"));

// Init
init();