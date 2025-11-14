import {app, BrowserWindow, nativeTheme, ipcMain, Menu} from 'electron'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const __filename = fileURLToPath(import.meta.url) // file:////c:/senac
const __dirname = path.dirname(__filename) // c:/senac/

let janela = criarJanela 

function criarJanela(){
    nativeTheme.themeSource = 'light' // modo claro/escuro da janela
    janela = new BrowserWindow({ 
        width: 800, height: 800,
        title: "Aplicação Desktop",  
        resizable: true,     
        webPreferences: {
            nodeIntegration: false,           
            contextIsolation: true,
            devTools: true,
            preload: path.join(__dirname,'preload.js'),
            sandbox: false,
            setZoomFactor: 1.0 //deixando o zoom em 100%
        }
    })}
    janela.loadFile('index.html') 
    //janela.webContents.openDevTools()
    //janela.webContents.setZoomFactor(1) //deixando o zoom em 100%
    
    // janela.removeMenu() //remover menu padrão do electron






