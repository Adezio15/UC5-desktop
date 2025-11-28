document.getElementById("btnEntrar")?.addEventListener("click", async () => {
  let dados = {
    login: document.getElementById("loginUsuario").value,
    senha: document.getElementById("senhaUsuario").value,
  };

  let res = await window.electronAPI.fazerLogin(dados);

  if (!res.ok) {
    alert("Login inválido!");
    return;
  }

  alert("Bem-vindo, " + res.nome + "!");
});
