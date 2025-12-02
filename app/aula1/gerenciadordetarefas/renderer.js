// Renderer: lógica da UI, gestão de tarefas, busca e notificações

const form = document.getElementById('taskForm')
const titleInput = document.getElementById('title')
const reminderInput = document.getElementById('reminder')
const priorityInput = document.getElementById('priority')
const contentInput = document.getElementById('content')
const tasksList = document.getElementById('tasksList')
const searchInput = document.getElementById('searchInput')
const searchBtn = document.getElementById('searchBtn')
const reloadBtn = document.getElementById('reloadBtn')
const saveAsBtn = document.getElementById('saveAs')
const exportBtn = document.getElementById('exportBtn')

let tasks = []
let notificationTimers = []

// Torna o array de tarefas global para o window (para salvar ao fechar)
window.tasks = tasks;

function nowISO(){
  return new Date().toISOString()
}

function renderTasks(list){
  tasksList.innerHTML = ''
  if(!list.length){
    tasksList.innerHTML = '<li>Nenhuma tarefa encontrada.</li>'
    return
  }
  list.forEach(t => {
    const li = document.createElement('li')
    li.className = 'task-item'
    li.innerHTML = `
      <strong>${t.title}</strong>
      <div class="meta">Criado: ${new Date(t.createdAt).toLocaleString()} | Lembrete: ${t.reminder ? new Date(t.reminder).toLocaleString() : '-'} | Prioridade: <span class="priority-${t.priority}">${t.priority}</span></div>
      <p>${t.content || ''}</p>
    `
    tasksList.appendChild(li)
  })
}

function scheduleNotifications(){
  // limpar timers anteriores
  notificationTimers.forEach(tm => clearTimeout(tm))
  notificationTimers = []

  tasks.forEach(t => {
    if (!t.reminder) return
    const ms = new Date(t.reminder).getTime() - Date.now()
    if (ms <= 0) return
    const tm = setTimeout(()=>{
      showNotification(t)
    }, ms)
    notificationTimers.push(tm)
  })
}

function showNotification(task){
  // Usar API Notification do navegador (funciona no Electron)
  try{
    const notif = new Notification(task.title, {
      body: task.content || 'Lembrete de tarefa',
    })
    notif.onclick = () => {
      window.focus()
    }
  }catch(e){
    console.warn('Não foi possível mostrar notificação:', e)
  }
}

async function loadTasks(){
  const res = await window.api.loadTasks()
  if (!res.ok){
    alert('Erro ao carregar tarefas: ' + res.error)
    tasks = []
  } else {
    tasks = res.tasks || []
  }
  renderTasks(tasks)
  scheduleNotifications()
}

async function saveTasks(){
  const res = await window.api.saveTasks(tasks)
  if (!res.ok){
    alert('Erro ao salvar: ' + res.error)
  } else {
    // sucesso silencioso
  }
}

form.addEventListener('submit', async (ev)=>{
  ev.preventDefault()
  const title = titleInput.value.trim()
  if(!title) return alert('Título é obrigatório')
  const t = {
    id: Date.now().toString(),
    title,
    createdAt: new Date().toISOString(),
    reminder: reminderInput.value ? new Date(reminderInput.value).toISOString() : null,
    content: contentInput.value,
    priority: priorityInput.value
  }
  tasks.unshift(t)
  await saveTasks()
  renderTasks(tasks)
  scheduleNotifications()
  form.reset()
})

searchBtn.addEventListener('click', ()=>{
  const q = searchInput.value.trim().toLowerCase()
  const found = tasks.filter(t=> t.title.toLowerCase().includes(q))
  renderTasks(found)
})

reloadBtn.addEventListener('click', ()=>{
  loadTasks()
})

saveAsBtn.addEventListener('click', async ()=>{
  const choice = await window.api.chooseSaveLocation()
  if (choice.canceled) return
  const res = await window.api.exportTasks(tasks, choice.path)
  if (!res.ok) alert('Erro ao exportar: ' + res.error)
  else alert('Exportado com sucesso para ' + choice.path)
})

exportBtn.addEventListener('click', async ()=>{
  // mesma ação do salvar como
  const choice = await window.api.chooseSaveLocation()
  if (choice.canceled) return
  const res = await window.api.exportTasks(tasks, choice.path)
  if (!res.ok) alert('Erro ao exportar: ' + res.error)
  else alert('Exportado com sucesso para ' + choice.path)
})

// pedir permissão de notificação no carregamento
if (Notification && Notification.permission !== 'granted'){
  Notification.requestPermission()
}

window.addEventListener('DOMContentLoaded', ()=>{
  loadTasks()
})