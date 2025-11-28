import { app, BrowserWindow, ipcMain, nativeTheme } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let win = null;          // ← CORRIGIDO
let welcomeWin = null;   // ← CORRIGIDO

const caminhoArquivo = path.join(__dirname, "logins.json");
let usuarios = [];

// CARREGAR JSON
try {
  if (fs.existsSync(caminhoArquivo)) {
    usuarios = JSON.parse(fs.readFileSync(caminhoArquivo, "utf8"));
    console.log("✔ Dados carregados:", usuarios);
  } else {
    console.log("⚠ logins.json não existe, criando vazio...");
    fs.writeFileSync(caminhoArquivo, "[]", "utf8");
    usuarios = [];
  }
} catch (err) {
  console.error("❌ Erro ao carregar JSON:", err);
}

// FUNÇÃO SALVAR
function salvarUsuarios() {
  try {
    fs.writeFileSync(caminhoArquivo, JSON.stringify(usuarios, null, 2), "utf8");
    console.log("✔ Usuários salvos:", usuarios);
  } catch (err) {
    console.error("❌ Erro ao salvar usuários:", err);
  }
}

function criarJanela() {
  nativeTheme.themeSource = "light";

  win = new BrowserWindow({
    width: 800,
    height: 800,
    resizable: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.webContents.openDevTools({ mode: "detach" });
  win.loadFile("index.html");
}

app.whenReady().then(() => {
  criarJanela();

 app.on("before-quit", () => {
  salvarUsuarios();
});

});

// Salva ao fechar
app.on("window-all-closed", () => {
  salvarUsuarios();
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// CADASTRO
ipcMain.handle("cadastro:novo", (event, dados) => {
  console.log("📌 DEBUG → Recebi do renderer:", dados);
console.log("📌 Nome:", dados.nome);
console.log("📌 Login:", dados.login);
console.log("📌 Senha:", dados.senha);

  console.log("Recebendo cadastro:", dados);

  if (!dados || !dados.login) return { ok: false, erro: "dados inválidos" };

  const existe = usuarios.some((u) => u.login === dados.login);
  if (existe) return { ok: false, erro: "login já existe" };

  usuarios.push(dados);
  salvarUsuarios();

  console.log("Usuários agora:", usuarios);
  return { ok: true };
});

// LOGIN
ipcMain.handle("login:verificar", (event, dados) => {
  console.log("Verificando login:", dados);

  const user = usuarios.find(
    (u) => u.login === dados.login && u.senha === dados.senha
  );

  if (!user) return { ok: false };

  abrirJanelaBoasVindas(user.nome || user.login);
  return { ok: true, nome: user.nome || user.login };
});

// ABRIR JANELA DE BOAS-VINDAS
function abrirJanelaBoasVindas(nome) {
  welcomeWin = new BrowserWindow({
    width: 500,
    height: 350,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
  });

  welcomeWin.loadFile("welcome.html");

  welcomeWin.webContents.on("did-finish-load", () => {
    welcomeWin.webContents.send("welcome:nome", nome);
  });

  if (win && !win.isDestroyed()) {
    win.close();
    win = null;
  }

  welcomeWin.webContents.openDevTools({ mode: "detach" });
}








