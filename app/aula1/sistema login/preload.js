import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  cadastrar: (dados) => ipcRenderer.invoke("cadastro:novo", dados),
  fazerLogin: (dados) => ipcRenderer.invoke("login:verificar", dados),

  // Receber nome na janela welcome
  receberNomeWelcome: (callback) =>
    ipcRenderer.on("welcome:nome", (event, nome) => callback(nome)),
});



