import {app, Browserwindow} from 'electron'
import Patch, { dirname } from'path'
import { fileURLtopch } from 'url'
import fs from 'fs'
import { contextIsolated, sandboxed, title } from 'process'
import path from 'path'

const ___filename = fileURLtopch(import.meta.url)
const ___diname  = dirname(__dirname)

let janela = []
const criarjanela = () => {
    janela = new Browserwindow({
        title: 'APLICAÇÃO DESKTOP'
        height: 600,
        width: 400,
        resizable: true,
        webpreferences: {
            contextIsolated: true,
            nodeintegration: false,
            preload: path.join(___dirname, 'preload.js')
            sandbox: false

        }
    })}
    janela.removeMenu()







const arquivo = Patch.join(_dirname,'arquivo.txt)')

let dados = []

function escreverArq (){
    try{
        let pessoa = {nome: 'Maria Silva', cpf: '123.456.789-00'}
        dados.push(pessoa)
        fs.appendFileSync(arquivo, JSON.stringify(dados, null, 2), 'utf-8')

        // fs.writefilesync(arquivo, 'escrevendo no arquivo...', 'utf-8')
    }catch(err){
        console.error(err)
    }
    
}
let dados2 = null
function lerarq(){
    try{
        let conteudo = fs.readFileSync(arquivo, 'utf-8')
        dados2= JSON.parse(conteudo)
        console.log('conteudo do arquivo: ', JSON.parse(conteudo), '\n' )
        console.log('conteudo do array: ', dados2)
        // console.log('caminho: ', arquivo, '\n')
        // console.log('caminho: ', conteudo)
    } catch (err) {
        console.error(err)
    }
}







