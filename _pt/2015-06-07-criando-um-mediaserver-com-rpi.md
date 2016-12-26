---
title:  Criando um media server com Plex e Raspberry Pi 2 like a boss
date:   2015-06-07 19:00:00
description: Passo-a-passo de como transformar esse brinquedindo em algo super útil pra sua casa
layout: post
language: PT-BR
---

Olá, meus amigos. Fiz este guia pra quem quer economizar com NAS ou simplesmente não quer precisar ter o computador ligado pra assistir os filmes no Plex.

<!--more-->

#### O que você precisará para este guia:

- Raspberry Pi 2
- Cabo de rede
- HD externo com alimentação própria

#### Ao final deste guia você terá:

- Servidor Plex rodando no Raspberry Pi 2
- Download automático de torrents adicionados a uma pasta no dropbox
- Armazenamento de filmes baixados no HD externo
- Download automático de legendas em português

#### Agenda:

1. Criando a integração com o Dropbox
2. Formatando o HD externo em EXT3
3. Instalando e configurando o Transmission
4. Instalando e configurando o Plex
5. Criando a rotina de download de legendas

# 1. Criando integração com o Dropbox

A integração com o Dropbox é basicamente bem simples, o que vamos ter é uma pasta no Dropbox onde vamos jogar os arquivos .torrent, essa pasta será sicronizada com o Raspberry onde o Transmission carregará os .torrent.

### O “x” da questao

Acontece que não existe um client do Dropbox para processadores ARM. Então vamos ter que criar nossa própria solução.

A integração com o Dropbox e com o OpenSubtitles será feita em node.js, você pode usar as soluções já prontas ou basear-se pra criar suas próprias.

__Instalando o node.js e dependências:__

	cd ~/
	git clone git@github.com:Phlaphead/dropbox-sync-js.git
	cd dropbox-sync-js
	npm install
	node sync.js

Após rodar o projeto e autorizar, pode interromper o processo. Agora vamos configurar a integração final com o Dropbox.

Vamos usar as configurações geradas pelo dropbox-sync-js no *dropbox-downloader*.

	cd ~/
	git clone git@github.com:sergiovilar/dropbox-downloader.git
	mv /.dropbox_settings /dropbox-downloader/settings.json


Edite o arquivo settings.json para direcionar corretamente para suas pastas, por exemplo `/home/pi/torrents` localmente e `/Torrents` remotamente, onde a pasta remota é o caminho da sua pasta no Dropbox.

Agora vamos rodar em background:

	forever start index.js

Ao adicionar um arquivo à sua pasta no Dropbox, você verá que ela será baixada para a pasta local que você determinou.

# 2. Formatando o HD externo em EXT3

Esta é sem dúvida a parte mais trabalhosa de todo setup, é preciso um pouco de paciência pra fazer isso.
O melhor guia que achei até agora, e que eu também usei, foi [este][1].

# 3. Intalando e configurando o Transmission

Instale o transmisson-daemon e dê as permissões necessárias:

	sudo apt-get update
	sudo apt-get install transmission-daemon
	sudo usermod -a -G pi debian-transmission

Seu arquivo `/etc/transmission-daemon/settings.json` deve ficar como este:

	{
	"alt-speed-down": 50,
	"alt-speed-enabled": false,
	"alt-speed-time-begin": 540,
	"alt-speed-time-day": 127,
	"alt-speed-time-enabled": false,
	"alt-speed-time-end": 1020,
	"alt-speed-up": 50,
	"bind-address-ipv4": "0.0.0.0",
	"bind-address-ipv6": "::",
	"blocklist-enabled": false,
	"blocklist-url": "http://www.example.com/blocklist",
	"cache-size-mb": 4,
	"dht-enabled": true,
	"download-dir": "/mnt/external_hd",
	"download-limit": 100,
	"download-limit-enabled": 0,
	"download-queue-enabled": true,
	"download-queue-size": 3,
	"encryption": 1,
	"idle-seeding-limit": 30,
	"idle-seeding-limit-enabled": false,
	"incomplete-dir": "/mnt/external_hd",
	"incomplete-dir-enabled": false,
	"lpd-enabled": false,
	"max-peers-global": 200,
	"message-level": 2,
	"peer-congestion-algorithm": "",
	"peer-limit-global": 240,
	"peer-limit-per-torrent": 60,
	"peer-port": 51413,
	"peer-port-random-high": 65535,
	"peer-port-random-low": 49152,
	"peer-port-random-on-start": false,
	"peer-socket-tos": "default",
	"pex-enabled": true,
	"port-forwarding-enabled": false,
	"preallocation": 1,
	"prefetch-enabled": 1,
	"queue-stalled-enabled": true,
	"queue-stalled-minutes": 30,
	"ratio-limit": 2,
	"ratio-limit-enabled": false,
	"rename-partial-files": true,
	"rpc-authentication-required": false,
	"rpc-bind-address": "0.0.0.0",
	"rpc-enabled": true,
	"rpc-password": "{84d067b80037f40bb935a5099f2a5630772daa75MgKiGTF0",
	"rpc-port": 9091,
	"rpc-url": "/transmission/",
	"rpc-username": "transmission",
	"rpc-whitelist": "127.0.0.1",
	"rpc-whitelist-enabled": false,
	"scrape-paused-torrents-enabled": true,
	"script-torrent-done-enabled": false,
	"script-torrent-done-filename": "",
	"seed-queue-enabled": false,
	"seed-queue-size": 10,
	"speed-limit-down": 100,
	"speed-limit-down-enabled": false,
	"speed-limit-up": 40,
	"speed-limit-up-enabled": true,
	"start-added-torrents": true,
	"trash-original-torrent-files": false,
	"umask": 18,
	"upload-limit": 100,
	"upload-limit-enabled": 0,
	"upload-slots-per-torrent": 14,
	"utp-enabled": true,
	"watch-dir": "/home/pi/torrents",
	"watch-dir-enabled": true
	}

Note que as opções `watch-dir`, `download-dir` e `incomplete-dir` devem corresponder à pasta do Dropbox e ao seu HD externo.

Agora vamos iniciar o serviço:

	sudo service transmission-daemon start

Feito isso você já deve conseguir acessar o transmission em `http://<ip_do_seu_pi>:9091/transmission/web/`.

Se você tiver algum problema de permissão, dê uma olhada [nesta resposta][2].

# 4. Instalando e configurando o Plex

A parte mais simples do guia. Instale o Plex com a sequência de comandos a seguir:

	cd /tmp
	wget http://dev2day.de/plex-latest
	sudo dpkg -i plex*
	sudo service plexmediaserver restart

Você já poderá ver o Plex em http://\<ip_do_seu_pi\>:32400/web.

Recomendo fortemente que você siga os passos na seção Transcoding Tools [deste guia][3].

Se você receber uma mensagem de erro dizendo que seu dispositivo não tem capacidade de processamento suficiente ou algo do tipo, siga [este guia][4].

# 5. Criando rotina de download de legendas

Agora que temos nossos downloads configurados e nosso servidor Plex configurados, vamos às legendas. O próprio Plex tem uma integração com o OpenSubtitles mas nunca funcionou bem pra mim.

Vamos baixar o projeto e configurar:

	cd ~/
	git clone git@github.com:sergiovilar/subtitle-finder.git
	cd ~/subtitle-finder
	mv config.sample.json config.json

Edite a opção path no config.json para a pasta onde estão os filmes, se você seguiu o guia será `/mnt/external_hd`.

Agora basta iniciar:

	sudo su
	forever start index.js

Pronto!


[1]:	http://www.itechlounge.net/2012/01/linux-partition-and-format-external-hard-drive-as-ext3-filesystem/
[2]:	https://forum.transmissionbt.com/viewtopic.php?t=10456#p66296
[3]:	http://www.htpcguides.com/install-plex-media-server-on-raspberry-pi-2/
[4]:	http://www.htpcguides.com/fix-plex-server-is-not-powerful-enough-on-raspberry-pi-2/
