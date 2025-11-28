import {app, BrowserWindow, dialog, ipcMain, Menu} from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename) 

let janela = null

const criarJanela = () => {
    janela = new BrowserWindow({
        title: 'Aplicação Desktop',
        height: 600,
        width: 600,
        resizable: true,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
            preload: path.join(__dirname, 'preload.js'),
            sandbox: false
        }      
    })
    // janela.webContents.openDevTools()
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))
    janela.loadFile(path.join(__dirname,'index.html'))
}
const template = [
    {
        label: 'Arquivo',
        submenu: [
            { label: 'Novo (Arquivo)', click: () => janela.webContents.send("novoarquivo") },
            { label: 'Novo (Janela)', click: () => criarJanela() },
            { type: 'separator' },
            { label: 'Abrir', click: () => janela.webContents.send("menuabrir") },
            { label: 'Salvar', click: () => janela.webContents.send("menusalvar") },
            { label: 'Salvar Como', click: () => janela.webContents.send("menusalvarComo") },
            { type: 'separator' },
            { label: 'Sair', role: 'quit' }
        ]
    },
    {
        label: 'Editar',
        submenu: [
            { label: 'Desfazer', role: 'undo' },
            { label: 'Refazer', role: 'redo' },
            { type: 'separator' },
            { label: 'Copiar', role: 'copy' },
            { label: 'Colar', role: 'paste' },
            { label: 'Recortar', role: 'cut' },
            { label: 'Selecionar Tudo', role: 'selectAll' },
            { label: 'Limpar', role: 'delete' }
        ]
    },
    {
        label: 'Exibir',
        submenu: [
            { label: 'Zoom +', role: 'zoomIn' },
            { label: 'Zoom -', role: 'zoomOut' },
            { label: 'Tela cheia', role: 'togglefullscreen' }
        ]
    }
]

// apenas depois disso → criar janela
app.whenReady().then(() => {
    criarJanela()
})

app.whenReady().then(() => {
    criarJanela()
})

let caminhoArquivo = path.join(__dirname,'arquivo.txt')

//Função para salvar o arquivo
function escreverArq (conteudo){
    try{
        fs.writeFileSync(caminhoArquivo, conteudo, 'utf-8') // escreve no aquivo
    }catch(err){
        console.error(err)
    }
}

//função para abrir o arquivo
async function lerArq(){
    let {canceled, filePaths} = await dialog.showOpenDialog({
        title: 'Abrir caminhoArquivo',
        defaultPath: 'caminhoArquivo.txt',
        filters: [{name: 'Texto', extensions: ['txt', 'doc']}],
        properties: ['openFile']
    })
    if(canceled){
        return
    }
    caminhoArquivo = filePaths[0]
    try {
        let conteudo = fs.readFileSync(caminhoArquivo, 'utf-8')
        return conteudo
    } catch (err) {
        console.error(err)
    }  
}

ipcMain.handle('salvararq', (event, texto) =>{
    // console.log('Texto: ',texto)
    escreverArq(texto)    
    return caminhoArquivo
})

ipcMain.handle('abrirarq', (event) =>{
    let conteudo = lerArq()
    return conteudo
})

ipcMain.handle('salvarComoarq', (event, texto) => {
   dialog.showSaveDialog({
        title: 'Salvar como',
        defaultPath: 'caminhoArquivo',
        filters: [{name: 'Texto', extensions: ['txt', 'doc']}]
    }).then((resultado) => {
        if(resultado.canceled) return
        caminhoArquivo = resultado.filePath
        escreverArq(texto)        
    })
    return caminhoArquivo     
})



