# BOTjão
BOT ~~simples~~ para o discord. Começou simples, mas agora é um bot com diversos comandos, incluindo música, soundboard de efeitos sonoros, envio de imagens e postagens do reddit. Para adicionar o BOTjão ao seu servidor, [clique aqui](https://discord.com/oauth2/authorize?client_id=480515624838103050&scope=bot&permissions=8).

## Arquitetura
Independente da linguagem de programação utilizada, para o funcionamento de uma aplicação integrada ao Discord é necessário comunicar-se com a sua [API](https://discord.com/developers/docs/intro). Especificamente, esse bot é escrito em Javascript (Node.js) e utiliza a biblioteca [Discord.js](https://discord.js.org) como wrapper para as funcionalidades da API, facilitando bastante o desenvolvimento. Além disso, a estrutura do projeto e a organização dos scripts é baseada no [guia oficial do Discord.js](https://discordjs.guide/).

## Funcionalidades
### Música
Com o BOTjão é possível reproduzir músicas a partir de vídeos do youtube. Isso é feito com uso dos pacotes [ytsr](https://www.npmjs.com/package/ytsr) e [ytdl-core-discord](https://www.npmjs.com/package/ytdl-core-discord), para consultas por meio de web-scrapping e download de vídeos do youtube respectivamente.

Além de reproduzir músicas requisitadas individualmente, há possibilidade de requisitar playlists do youtube e do spotify. A lista de músicas das playlists é obtida através de requisições para a API oficial do serviço correspondente, enquanto o processo de busca/download para cada item da lista é feito com as bibliotecas já mencionadas.

Cada música é adicionada a uma fila de repridução (queue), que foi implementada utilizando a estrutura de dados Map do Javascript, a qual armazena pares de chavel/valor. Nesse caso, as chaves são as Ids dos servidores e os valores são objetos que armazenam informações como um array contendo os próximos vídeos e o canal ao qual o bot foi conectado.

### Soundboard
O sistema de soundboard reproduz áudios de alguma fonte na internet (e.g myinstants, alguma CDN). Para cada áudio é salvo um par com título e a url para a mídia. Para persistir essas informações, esse projeto utiliza o MongoDB através da biblioteca padrão do Mongo para Node, e hosteado no [Atlas](https://www.mongodb.com/cloud/atlas).

### Imagens / Posts do Reddit
Os comandos que retornam imagens aleatórias (serviços de APIs de imagens) ou posts de subreddits (o próprio reddit fornece resultados em JSON) fazem isso através de requisições HTTP com o [axios](https://www.npmjs.com/package/axios).

## Hospedagem
O BOTjão é hospedado no [Heroku](https://heroku.com), um serviço de cloud que oferece um plano gratuito para hospedagem de aplicações de diversas linguagens, incluindo Node.js, além de integração com o github para deploys automáticos.