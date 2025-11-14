// Código que manipula a UI dentro do index.html

// Navegação inicial
window.addEventListener('DOMContentLoaded', () => {
const registrar1 = document.getElementById('registrar');
const Login = document.getElementById('login1');
const registrar2 = document.getElementById('registrar2');
const login2 = document.getElementById('login2');
const Logout = document.getElementById('logout');


// verificar se já existe usuário logado
const current = window.api.getCurrentUser();
if (current) {
document.getElementById('welcome-name').innerText = current.nome;
showScreen('screen-welcome');
return;
}


showScreen('screen-choice');


btnToRegister.addEventListener('click', () => showScreen('registrar1'));
btnToLogin.addEventListener('click', () => showScreen('login1'));


registerForm.addEventListener('submit', (e) => {
e.preventDefault();
const data = {
nome: document.getElementById('reg-nome').value.trim(),
dataNascimento: document.getElementById('reg-dtnasc').value,
email: document.getElementById('reg-email').value.trim(),
login: document.getElementById('reg-login').value.trim(),
senha: document.getElementById('reg-senha').value
};


const res = window.api.register(data);
if (!res.success) {
alert(res.message);
return;
}
alert('Cadastro realizado com sucesso! Agora faça login.');
registerForm.reset();
showScreen('screen-login');
});


loginForm.addEventListener('submit', (e) => {
e.preventDefault();
const payload = {
login: document.getElementById('login1').value.trim(),
senha: document.getElementById('log-senha').value
};
const res = window.api.login(payload);
if (!res.success) {
alert(res.message);
return;
}
// direcionar para perfil/boas-vindas
document.getElementById('welcome-name').innerText = res.user.nome;
loginForm.reset();
showScreen('screen-welcome');
});


btnLogout.addEventListener('click', () => {
window.api.logout();
showScreen('screen-choice');
});
});