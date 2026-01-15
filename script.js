/* =========================================
   1. CORE STATE & DEFAULTS
   ========================================= */
const defaultSettings = {
  userName: "Raj",
  userRole: "Hacker • Coder • Security",
  promptLabel: "raj@terminal:~$",
  inputPlaceholder: "Type alias or URL...",
  aliases: {
    yt: "https://youtube.com",
    gh: "https://github.com",
    gpt: "https://chat.openai.com",
    gg: "https://google.com",
    rd: "https://reddit.com",
    loc: "http://localhost:8080",
    thm: "https://tryhackme.com"
  }
};

let settings = JSON.parse(localStorage.getItem("terminalConfig")) || defaultSettings;

/* =========================================
   2. DOM REFERENCES
   ========================================= */
const cmd = document.getElementById("cmd");
const suggest = document.getElementById("suggest");
const userNameDisplay = document.getElementById("userNameDisplay");
const roleText = document.getElementById("roleText");
const promptLabel = document.getElementById("promptLabel");
const greetElement = document.getElementById("greet");

const configOverlay = document.getElementById("configOverlay");
const closeConfigBtn = document.getElementById("closeConfigBtn");
const saveConfigBtn = document.getElementById("saveConfigBtn");
const addAliasBtn = document.getElementById("addAliasBtn");
const configAliasList = document.getElementById("configAliasList");
const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const importFile = document.getElementById("importFile");
const resetBtn = document.getElementById("resetBtn");

/* =========================================
   3. INITIALIZATION & UI
   ========================================= */
function init() {
  userNameDisplay.textContent = settings.userName;
  roleText.textContent = settings.userRole;
  promptLabel.textContent = settings.promptLabel;
  cmd.placeholder = settings.inputPlaceholder;
  updateGreeting();
  cmd.focus();
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
init();

/* =========================================
   4. CURSOR & HOVER LOGIC
   ========================================= */
const cursorDot = document.getElementById("cursor-dot");
const cursorRing = document.getElementById("cursor-ring");
const light = document.getElementById("light");
let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0, lightX = 0, lightY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursorDot.style.left = mouseX + "px"; cursorDot.style.top = mouseY + "px";
});

function animateCursor() {
  cursorX += (mouseX - cursorX) * 0.15;
  cursorY += (mouseY - cursorY) * 0.15;
  cursorRing.style.left = cursorX + "px"; cursorRing.style.top = cursorY + "px";
  lightX += (mouseX - lightX) * 0.05;
  lightY += (mouseY - lightY) * 0.05;
  light.style.left = lightX + "px"; light.style.top = lightY + "px";
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
attachHover(document.querySelectorAll("a, input, button, .close-btn"));

const mainCard = document.getElementById("mainCard");
mainCard.addEventListener("mouseenter", () => document.body.classList.add("focus-mode"));
mainCard.addEventListener("mouseleave", () => document.body.classList.remove("focus-mode"));

/* =========================================
   5. COMMAND INPUT & ALIASES
   ========================================= */
let matches = [];
let selectedIndex = 0;

cmd.addEventListener("input", () => {
  const v = cmd.value.toLowerCase();
  suggest.innerHTML = ""; matches = []; selectedIndex = 0;
  
  if (!v) { suggest.style.display = "none"; return; }
  
  matches = Object.keys(settings.aliases).filter(k => k.includes(v));
  matches.forEach((a, i) => {
    const d = document.createElement("div");
    d.textContent = `${a}  →  ${settings.aliases[a]}`;
    if (i === 0) d.classList.add("active");
    d.onclick = () => openLink(a);
    suggest.appendChild(d);
  });
  
  suggest.style.display = matches.length ? "block" : "none";
  attachHover(suggest.querySelectorAll("div"));
});

cmd.addEventListener("keydown", (e) => {
  if (e.key === "Tab" && matches.length) {
    e.preventDefault();
    cmd.value = matches[selectedIndex];
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
    if (matches.length && suggest.style.display !== "none") checkCommand(matches[selectedIndex]);
    else checkCommand(cmd.value);
  }
});

function updateSelection() {
  Array.from(suggest.children).forEach((el, i) => el.classList.toggle("active", i === selectedIndex));
}

function checkCommand(v) {
  v = v.trim().toLowerCase();
  if (v === "config") { openConfig(); cmd.value = ""; suggest.style.display="none"; return; }
  if (v === "ls -a") { openListOverlay(); cmd.value = ""; return; }
  if (v === "sudo") { 
    document.body.classList.toggle("root-mode");
    updateRootModeVisuals();
    cmd.value = ""; return; 
  }
  if (v === "matrix") { toggleMatrix(); cmd.value = ""; return; }
  if (v === "hack") { startHack(); cmd.value = ""; return; }
  if (v === "party") { document.body.classList.toggle("party-mode"); cmd.value = ""; return; }
  if (v === "404") { triggerGlitch(); cmd.value = ""; return; }
  if (v === "clear") { cmd.value = ""; return; }
  
  openLink(v);
}

function openLink(v) {
  if (settings.aliases[v]) window.open(settings.aliases[v], "_self");
  else if (v.startsWith("http")) window.open(v, "_self");
  else if (v.includes(".")) window.open("https://" + v, "_self");
  else if (v) window.open("https://duckduckgo.com/search?q=" + v, "_self");
}

/* =========================================
   6. CONFIG & BACKUP SYSTEM
   ========================================= */
function openConfig() {
  configOverlay.style.display = "flex";
  document.getElementById("confName").value = settings.userName;
  document.getElementById("confRole").value = settings.userRole;
  document.getElementById("confPrompt").value = settings.promptLabel;
  document.getElementById("confPlace").value = settings.inputPlaceholder;
  renderConfigAliases();
}

function closeConfig() {
  configOverlay.style.display = "none";
  cmd.focus();
}

function renderConfigAliases() {
  configAliasList.innerHTML = "";
  Object.keys(settings.aliases).sort().forEach(key => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="color:#fff; font-weight:bold;">${key}</td>
      <td style="opacity:0.7;">${settings.aliases[key]}</td>
      <td style="text-align:right;"><button class="btn-del" onclick="removeAlias('${key}')">DELETE</button></td>
    `;
    configAliasList.appendChild(tr);
  });
  attachHover(configAliasList.querySelectorAll(".btn-del"));
}

window.removeAlias = function(key) {
  delete settings.aliases[key];
  renderConfigAliases();
};

addAliasBtn.addEventListener("click", () => {
  const k = document.getElementById("newAliasKey").value.trim().toLowerCase();
  const u = document.getElementById("newAliasUrl").value.trim();
  if (k && u) {
    settings.aliases[k] = u;
    document.getElementById("newAliasKey").value = "";
    document.getElementById("newAliasUrl").value = "";
    renderConfigAliases();
  }
});

saveConfigBtn.addEventListener("click", () => {
  settings.userName = document.getElementById("confName").value || "User";
  settings.userRole = document.getElementById("confRole").value || "Role";
  settings.promptLabel = document.getElementById("confPrompt").value || "$";
  settings.inputPlaceholder = document.getElementById("confPlace").value || "...";
  
  localStorage.setItem("terminalConfig", JSON.stringify(settings));
  location.reload();
});

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
      if (parsed.userName && parsed.aliases) {
        localStorage.setItem("terminalConfig", JSON.stringify(parsed));
        alert("Backup restored! System rebooting...");
        location.reload();
      } else {
        alert("Invalid backup file.");
      }
    } catch { alert("Error parsing file."); }
  };
  reader.readAsText(file);
});

// RESET BUTTON
resetBtn.addEventListener("click", () => {
  if(confirm("WARNING: This will wipe all your custom settings and aliases.\n\nAre you sure you want to reset to defaults?")) {
    localStorage.removeItem("terminalConfig");
    alert("System reset complete. Rebooting...");
    location.reload();
  }
});

/* =========================================
   7. EXTRAS
   ========================================= */
const matrixCanvas = document.getElementById("matrix-canvas");
const ctx = matrixCanvas.getContext("2d");
let matrixInterval;
function resizeMatrix() { matrixCanvas.width = window.innerWidth; matrixCanvas.height = window.innerHeight; }
window.addEventListener("resize", resizeMatrix); resizeMatrix();

const chars = "010101 HACK CODE LINUX";
const charArr = chars.split("");
const fontSize = 14;
let columns = matrixCanvas.width / fontSize;
let drops = [];

function toggleMatrix() {
  if (document.body.classList.contains("matrix-active")) {
    document.body.classList.remove("matrix-active");
    clearInterval(matrixInterval);
    ctx.clearRect(0, 0, matrixCanvas.width, matrixCanvas.height);
  } else {
    document.body.classList.add("matrix-active");
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
}

function startHack() {
  const overlay = document.getElementById("hackOverlay");
  const log = document.getElementById("hackLog");
  const msg = document.getElementById("hackMsg");
  overlay.style.display = "flex"; log.innerHTML = ""; msg.style.display = "none";
  let lines = ["Init brute force...", "Target: 127.0.0.1", "Bypassing firewall...", "Accessing DB...", "Root Access: GRANTED"];
  let i = 0;
  let inv = setInterval(() => {
    log.innerHTML += lines[i] + "\n";
    if(++i >= lines.length) { clearInterval(inv); msg.style.display="block"; setTimeout(()=>overlay.style.display="none", 2000); }
  }, 400);
}

function triggerGlitch() {
  document.body.classList.add("glitch-active");
  setTimeout(() => document.body.classList.remove("glitch-active"), 500);
}

function updateRootModeVisuals() {
  const isRoot = document.body.classList.contains("root-mode");
  if (isRoot) {
    roleText.textContent = "ROOT // SYSTEM ADMINISTRATOR";
    roleText.style.color = "#fff";
    promptLabel.textContent = "root@system:~#";
  } else {
    roleText.textContent = settings.userRole;
    roleText.style.color = "var(--green)";
    promptLabel.textContent = settings.promptLabel;
  }
}

const listOverlay = document.getElementById("listOverlay");
function openListOverlay() {
  const grid = document.getElementById("aliasGrid");
  grid.innerHTML = "";
  Object.keys(settings.aliases).sort().forEach(k => {
    const d = document.createElement("div");
    d.className = "alias-item";
    d.innerHTML = `<span class="alias-key">${k}</span><span class="alias-url">${settings.aliases[k]}</span>`;
    d.onclick = () => { openLink(k); listOverlay.style.display="none"; };
    grid.appendChild(d);
  });
  listOverlay.style.display = "flex";
  attachHover(grid.querySelectorAll(".alias-item"));
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    configOverlay.style.display = "none";
    listOverlay.style.display = "none";
    cmd.focus();
  }
});