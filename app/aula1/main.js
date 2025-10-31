import {app, BrowserWindow} from 'electron'

const criarJanela = () =>{
    const janela = new BrowserWindow({
    width:  800, 
    height:  800
    })
janela.loadFile('calculadora.html')

}

app.whenReady().then ( () => {
    criarJanela()
    console.log('executando electron')
})
 .catch ((erro) => {           
    console.erro(erro)
})


