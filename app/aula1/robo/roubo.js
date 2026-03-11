import time
import requests

PRODUTO = "ar condicionado"
INTERVALO = 120  # tempo em segundos (aqui: 2 minutos)
LIMITE = 10      # quantos produtos mostrar

def buscar_mais_baratos(termo, limite=10):
    url = "https://api.mercadolibre.com/sites/MLB/search"
    params = {
        "q": termo,
        "sort": "price_asc",
        "limit": limite
    }

    r = requests.get(url, params=params)
    dados = r.json()

    print(f"\n=== MAIS BARATOS PARA '{termo.upper()}' ===")

    for item in dados["results"]:
        print(f"\n{item['title']}")
        print(f"Preço: R$ {item['price']}")
        print(f"Link: {item['permalink']}")

def monitorar():
    while True:
        buscar_mais_baratos(PRODUTO, LIMITE)
        print(f"\n🔁 Verificando novamente em {INTERVALO} segundos...\n")
        time.sleep(INTERVALO)

# Iniciar o monitor
monitorar()
