import { app, BrowserWindow, ipcMain, nativeTheme } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let usuarios = []; // banco em memória
let win = null;

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
      sandbox: false,
    },
  });

  win.loadFile("index.html");
}

app.whenReady().then(criarJanela);

// RECEBE CADASTRO
ipcMain.handle("cadastro:novo", (event, dados) => {
  usuarios.push(dados);
  console.log("Usuários cadastrados:", usuarios);
  return { ok: true };
});

// VERIFICA LOGIN
ipcMain.handle("login:verificar", (event, dados) => {
  let user = usuarios.find(
    (u) => u.login === dados.login && u.senha === dados.senha
  );

  if (!user) return { ok: false };

  return { ok: true, nome: user.nome };
});






