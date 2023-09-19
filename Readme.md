# MVP-PUCRJ - Frontend
Meu Front:
Este projeto contém o frontend do projeto Quiz App.

## Como executar em modo desenvolvimento 
Basta fazer o download do projeto e abrir o arquivo index.html no seu browser.

## Como executar através do Docker

Certifique-se de ter o [Docker] (https://docs.docker.com/engine/install/) instalado e em execução em sua máquina.

Navegue até o diretório que contém o Dockerfile no terminal.
Execute **como administrador** o seguinte comando para construir a imagem Docker:

```
$ docker build -t front-quiz .
```

Uma vez criada a imagem, para executar o container basta executar, **como administrador**, o seguinte comando:

```
$ sudo docker run --rm -p 8080:80 front-quiz
```

Uma vez executando, para acessar o front-end, basta abrir o [http://localhost:8080/#/](http://localhost:8080/#/) no navegador.


# API Externa #1: 
https://opentdb.com/api_config.php

# Descrição: API de curiosidades:
O Open Trivia Database fornece uma API JSON totalmente gratuita para uso em projetos de programação. O uso desta API não requer uma chave de API, apenas gere a URL abaixo e use-a em seu próprio aplicativo para recuperar perguntas triviais.
Todos os dados fornecidos pela API estão disponíveis sob a Licença Internacional Creative Commons Attribution-ShareAlike 4.0

# Rotas Utilizadas: 
https://opentdb.com/api.php?amount=${amount}&category=${category}



# API Externa #2: 
https://viacep.com.br/

# Descrição: API de CEP:
VIACEP é um webservice gratuito e de alto desempenho para consultar Códigos de Endereçamento Postal (CEP) do Brasil. O uso desta API não requer uma chave de API.

# Rotas Utilizadas: 
https://viacep.com.br/ws/${cepValue}/json/


# API Externa #3: 
https://www.boredapi.com/

# Descrição: API de CEP:
The Bored API Let's find you something to do - API para retornar frases em inglês sobre encontrar coisas para se fazer. O uso desta API não requer uma chave de API.

# Rotas Utilizadas: 
https://www.boredapi.com/api/activity/