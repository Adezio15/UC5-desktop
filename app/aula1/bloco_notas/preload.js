import { contextBridge, ipcRenderer } from "electron"

contextBridge.exposeInMainWorld('api', {
    salvar: (texto) => ipcRenderer.invoke('salvararq', texto),
    salvararquivo: (callback) => ipcRenderer.on('menusalvar', () => callback()),

    abrir: () => ipcRenderer.invoke('abrirarq'),
    abrirarquivo: (callback) => ipcRenderer.on('menuabrir', () => callback()),

    salvarComo: (texto) => ipcRenderer.invoke('salvarComoarq', texto), 
    salvarmenu: (callback) => ipcRenderer.on('menusalvarComo', () => callback()),
    novoarquivo: (callback) => ipcRenderer.on('novoarquivo', () => callback()),
    salvarArq: (callback) => ipcRenderer.on('salvarArquivo', () => callback()),

})