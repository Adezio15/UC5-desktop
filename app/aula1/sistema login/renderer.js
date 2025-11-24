// SALVAR CADASTRO
document.getElementById("btnSalvar")?.addEventListener("click", async () => {
  let dados = {
    nome: document.getElementById("cad-nome").value,
    data: document.getElementById("cad-data").value,
    email: document.getElementById("cad-email").value,
    login: document.getElementById("cad-login").value,
    senha: document.getElementById("cad-senha").value,
  };

  let res = await window.electronAPI.cadastrar(dados);

  if (res.ok) {
    alert("Cadastro realizado com sucesso!");
    window.location.href = "index.html";
  }
});

// LOGIN
document.getElementById("btnEntrar")?.addEventListener("click", async () => {
  let dados = {
    login: document.getElementById("loginUsuario").value,
    senha: document.getElementById("senhaUsuario").value,
  };

  let res = await window.electronAPI.fazerLogin(dados);

  if (!res.ok) {
    alert("Login ou senha incorretos!");
    return;
  }

  alert("Bem-vindo, " + res.nome + "!");
});

