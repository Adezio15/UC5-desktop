import {app, BrowserWindow, nativeTheme, ipcMain, Menu} from 'electron'
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
        resizable: true,     
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

    Menu.setApplicationMenu(Menu.buildFromTemplate(template)) // criação do menu
}
//criação do tempate para o menu
const template = [
    {label: "Arquivo", 
        submenu:[
            {label: "Novo", click: () => criarJanela()},
            {type: 'separator'},
            {label: "Sair", role: 'quit'}]}, 


    
    {label: 'Exibir', 
        submenu: [{label: 'Aparência', 
            submenu:[
                {label: 'Zoom+', type: 'radio', checked: false, 
                click: () => {
                    let janelaatual = janela.webContents.getZoomFactor()    
                    janela.webContents.setZoomFactor(0.1 + janelaatual)},
                accelerator: 'ctrl + =', },
                {label: 'Zoom-', role: 'zoomout'},
                {label: 'Trocar tema', type: 'checkbox', checked: false, 
                    click: () => nativeTheme.themeSource = 'dark'}                
            ]
        }]}
]

app.whenReady().then(() => { 
        criarJanela()

})
  
app.on('window-all-closed', () => {
    if(process.platform !== 'darwin'){
        app.quit()
    }
})

ipcMain.on('mudar-tema', () => { //recebe o evento do renderer para mudar o tema
    if(nativeTheme.themeSource === 'dark'){
        nativeTheme.themeSource = 'light'
    }else{
        nativeTheme.themeSource = 'dark'
    }
})

ipcMain.on('mudar-zoom', () => { //recebe o evento do renderer para aumentar o zoom
    let janelaatual = janela.webContents.getZoomFactor()
    console.log(janelaatual)
    janela.webContents.setZoomFactor(0.1 + janelaatual)
    
})

ipcMain.on('mudar-zoom-menos', () => { //recebe o evento do renderer para aumentar o zoom
    let janelaatual = janela.webContents.getZoomFactor()
    console.log(janelaatual)
    janela.webContents.setZoomFactor(janelaatual-0.1 )
    
})

ipcMain.on('criar-janela', () => { //recebe o evento do renderer para criar uma nova janela
    criarJanela()
})

ipcMain.handle('calc-soma', (event, n1 , n2) => { // recebe o evento do renderer para calcular a soma
    console(n1+n2)
    return n1+n2
})

let historico = []
ipcMain.on('envia-msg', (event, msg) => { //recebe o evento do renderer com uma mensagem
    historico.push(msg)
    console.log('Mensagem do Renderer: ', historico)
    event.reply('devolver-msg', historico) //envia uma mensagem de volta para o renderer
})








