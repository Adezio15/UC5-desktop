import {app, BrowserWindow, nativeTheme, ipcMain} from 'electron'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const __filename = fileURLToPath(import.meta.url) // file:////c:/senac
const __dirname = path.dirname(__filename) // c:/senac/

let janela = null 

function criarJanela(){
    nativeTheme.themeSource = 'light' // modo claro/escuro da janela
    janela = new BrowserWindow({ 
        width: 800, height: 800,
        title: "Aplicação Desktop",       
        webPreferences: {
            nodeIntegration: false,           
            contextIsolation: true,
            devTools: true,
            preload: path.join(__dirname,'preload.js'),
            sandbox: false,
            setZoomFactor: 1.0 //deixando o zoom em 100%
        }
    })
    janela.loadFile('jogoadvinha.html') 
    //janela.webContents.openDevTools()
    //janela.webContents.setZoomFactor(1) //deixando o zoom em 100%
    
    janela.removeMenu() //remover menu padrão do electron

    janela.webContents.on('did-finish-load', () => { //evento disparado quando a janela termina de carregar
        janela.webContents.setZoomFactor(1.0) 
    }) 
}

app.whenReady().then(() => { 
        criarJanela()

})
  
app.on('window-all-closed', () => {
    if(process.platform !== 'darwin'){
        app.quit()
    }
})

ipcMain.on('mudartema', () => { //recebe o evento do renderer para mudar o tema
    if(nativeTheme.themeSource === 'dark'){
        nativeTheme.themeSource = 'light'
    }else{
        nativeTheme.themeSource = 'dark'
    }
})

ipcMain.on('maiszoom', () => { //recebe o evento do renderer para aumentar o zoom
    let janelaatual = janela.webContents.getZoomFactor()
    janela.webContents.setZoomFactor(0.1 + janelaatual)
    
})
ipcMain.on('menoszoom', () => { //recebe o evento do renderer para aumentar o zoom
    let janelaatual = janela.webContents.getZoomFactor()
    janela.webContents.setZoomFactor( janelaatual - 0.1)
    
})
ipcMain.on('criar-janela', () => { //recebe o evento do renderer para criar uma nova janela
    criarJanela()
})

ipcMain.handle('calc-soma', (event, n1 , n2) => { // recebe o evento do renderer para calcular a soma
    return n1+n2
})

ipcMain.on('envia-msg', (event, msg) => { //recebe o evento do renderer com uma mensagem
    console.log('Mensagem do Renderer: ', msg)
    event.reply('devolver-msg', 'Olá') //envia uma mensagem de volta para o renderer
})
// ipcMain.on('reset', () => { //recebe o evento do renderer para aumentar o zoom
//     let janelaatual = janela.webContents.reset()
//     janela.webContents.reset())
// })