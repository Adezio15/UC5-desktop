import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  saveTasks: (tasks) => ipcRenderer.invoke('save-tasks-to-file', tasks),
  loadTasks: () => ipcRenderer.invoke('load-tasks-from-file'),
  chooseSaveLocation: () => ipcRenderer.invoke('choose-save-location'),
  exportTasks: (tasks, path) => ipcRenderer.invoke('export-tasks', tasks, path),
  on: (channel, cb) => {
    ipcRenderer.on(channel, (e, ...args) => cb(...args))
  }
})