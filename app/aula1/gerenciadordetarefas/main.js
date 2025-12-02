import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import path from 'node:path'
import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  mainWindow.loadFile(path.join(__dirname, 'index.html'))
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('before-quit', async (event) => {
  // Salvar tarefas mais recentes do renderer antes de fechar
  try {
    if (mainWindow && mainWindow.webContents) {
      // Solicita as tarefas atuais do renderer
      const tasks = await mainWindow.webContents.executeJavaScript('window.tasks || []');
      const file = tasksFilePath();
      await fs.writeFile(file, JSON.stringify(tasks, null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('Erro ao salvar tarefas antes de sair:', err);
  }
})

// caminho padrão para salvar tarefas
function tasksFilePath() {
  return path.join(__dirname, 'tasks.json')
}

// Handlers ipc
ipcMain.handle('save-tasks-to-file', async (event, tasks) => {
  const file = tasksFilePath()
  try {
    await fs.writeFile(file, JSON.stringify(tasks, null, 2), 'utf-8')
    return { ok: true, path: file }
  } catch (err) {
    return { ok: false, error: err.message }
  }
})

ipcMain.handle('load-tasks-from-file', async () => {
  const file = tasksFilePath()
  try {
    const exists = await fs.stat(file).then(()=>true).catch(()=>false)
    if (!exists) {
      await fs.writeFile(file, '[]', 'utf-8')
      return { ok: true, tasks: [] }
    }
    const raw = await fs.readFile(file, 'utf-8')
    const tasks = JSON.parse(raw || '[]')
    return { ok: true, tasks }
  } catch (err) {
    return { ok: false, error: err.message }
  }
})

ipcMain.handle('choose-save-location', async () => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: 'Salvar tarefas como',
    defaultPath: 'tasks.json',
    filters: [{ name: 'JSON', extensions: ['json'] }]
  })
  if (canceled) return { canceled: true }
  try {
    const file = filePath
    return { canceled: false, path: file }
  } catch (err) {
    return { canceled: true, error: err.message }
  }
})

ipcMain.handle('export-tasks', async (event, tasks, exportPath) => {
  try {
    await fs.writeFile(exportPath, JSON.stringify(tasks, null, 2), 'utf-8')
    return { ok: true }
  } catch (err) {
    return { ok: false, error: err.message }
  }
})
