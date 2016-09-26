---
title: "React: Notas de desenvolvimento"
date:   2016-09-25 15:00:00
tags: [react,javascript,es6,jsx]
category: javascript
layout: post
banner_image: react.png
---

Neste post vou dar algumas dicas e fazer algumas observações sobre a experiência de desenvolver com React.

Se você ainda não leu [meu primeiro post](http://vilar.cc/2016/comecando-com-react/) sobre o assunto, recomendo que dê uma lida antes de continuar neste post.

<!--more-->

## Controlando estado

Diferentemente do Angular onde o *two way data-binding* funciona como mágica sempre que alguma propriedade do `$scope` é modificada, no React é preciso usar a função `setState()` pra isso. Vamos a um exemplo:

{% highlight js %}
{% raw %}
class MyComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      myName: 'Say my name'
    }
  }

  change(e) {
    this.setState({myName: e.target.value})
  }

  render() {
    return (
      <span>{{ myName }}</span>
      <inptut type="text" onChange="{this.change.bind(this)}" />
    )
  }
}
{% endraw %}
{% endhighlight %}

Como podemos observar, também é necessário setar um estado inicial populando diretamente o `this.state`.

**Notinha:** Você não é obrigado a passar todos os atributos do state no `setState`, se eu tenho por exemplo este estado inicial:

{% highlight js %}
this.state = {
    a: 'Hello',
    b: 'Goodbye'
}
{% endhighlight %}

Posso simplesmente chamar:

{% highlight js %}
this.setState({a: 'Hello hello'})
{% endhighlight %}

### `setState` é assíncrono

Não é possível ter certeza de quando o `setState` terá de fato alterado os valores em `this.state`, vamos ver um exemplo sobre isso baseado no último pedaço de código:

{% highlight js %}
class MyComponent extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      myName: 'Say my name'
    }
    this.changeName()
  }

  changeName() {
    this.setState({myName: 'Heisenberg'})
    this.alertChange()
  }

  alertChange(){
    alert(this.state.myName) // Alerts 'Say my name'
  }

}
{% endhighlight %}

Como você pode ver, o que será alertado no método `alertChange` será "*Say my name*", o estado inicial de `myName`. Isso acontece porque `setState` é assíncrono e no momento que o `alert` é chamado ele ainda não populou `this.state` com os novos dados.

## Comunicação entre componentes

Vamos fazer um pouco de recursividade aqui: se você tem certeza que vai usar Flux ou Redux no seu projeto, pode pular esse tópico e ir direto pro seguinte. Caso se arrependa dessa decisão, pode voltar aqui.

Esta é a minha parte preferida do React, como podemos comunicar entre componentes sem usar o Flux ou Redux. O que mais costumo usar nos meus projetos são as práticas de `props`, `ref functions` e `callback functions`. Você pode ver muito detalhadamente algumas alternativas para comunicação entre componentes com exemplos de uso [aqui](http://andrewhfarmer.com/component-communication/).

## Você pode não precisar usar Flux e Redux

Antes de mais nada recomendo expressivamente você ler um pouco sobre essas duas libs e entender como elas funcionam. Você provavelmente vai estranhar no primeiro instante e isso é *ok*.

Não vou me demorar muito escrevendo uma série de argumentos sobre porquê talvez você não precise usar Flux ou Redux porque alguém muito mais gabaritado [fez isso por mim](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367).

### Qual architetura da sua aplicação?

Acredito que esta seja a pergunta chave aqui pois em algumas situações vai ser praticamente impossível ou extremamente desnecessário *em minha opinião* usar Flux ou Redux.

Se você está trabalhando numa aplicação tradicional com Rails ou Laravel, por exemplo, ou sua app não é completamente escrita em JS **Eu** não vejo muito sentido em *complicar desnecessariamente* o seu trabalho usando Redux quando você pode simplesmente controlar o estado do seu componente localmente.

### Complexidade de código

Partindo do princípo que sim, você tem uma app escrita em javascript e que precisa de uma arquitetura para usar com o React, você ainda deve pensar a respeito se vale a pena e isso é explicado minuciosamente no post do Dan Abramov que pus o link logo acima.











