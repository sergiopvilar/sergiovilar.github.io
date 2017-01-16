---
layout: post
title: 'Javascript no Browser: Concat vs Entrypoints'
---

Uma tendência que começou alguns anos atrás com a chegada do Grunt e
do Gulp foi a concatenação de vários arquivos javascript num único,
assim ficava mais fácil ofuscar e comprimir tudo num arquivo só além
de claro a performance melhoraria bastante no browser.

Mas como nada no mundo do javascript é estável, aparentemente estamos
vivenciando mais uma leve mudança de paradigmas onde os concats com
seus namespaces e bibliotecas carregadas no escopo global (ou AMD para
os corajosos) são trocados pela prática do único, na maioria das
vezes, entrypoint.

Eu comecei a observar isso quando precisei lidar com módulos CommonJS
no browser e fiquei me perguntando "em que parte do processo
browserify vai concatenar os arquivos" e percebi que a resposta era
simples: em nenhuma.

Sabe qual é o pior de tudo? Criar uma árvore de dependências faz
**muito sentido**! Vou listar algumas das vantagens.

### Escopo Isolado de dependências

Quer usar uma biblioteca numa classe e outra semelhante em outra? Não
tem problema, o require isola aquele a dependência àquela classe mas
também não se preocupe, ela será reutilizada num escopo diferente se
você usá-la em outra classe.

### Dependências circulares nunca mais

O pesadelo das dependências circulares acaba quando você está
construindo uma árvore de dependências. Encontrou uma proeza dessas
por aí? Tá na hora de pensar num design pattern melhor pra resolver
seu problema (um módulo compartilhado pode ajudar).

### Você pode facilmente usar Webpack ou Browserify

Como esses dois camaradas partem do princípio de entrypoints você pode
facilmente migrar sua aplicação pra ES6 com CommonJS.

Por hoje é isso aí, deixe nos comentários como está o setup da sua
aplicação javascript! Até mais.
