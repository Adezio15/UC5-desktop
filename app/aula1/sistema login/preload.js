import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  cadastrar: (dados) => ipcRenderer.invoke("cadastro:novo", dados),
  fazerLogin: (dados) => ipcRenderer.invoke("login:verificar", dados),
});



