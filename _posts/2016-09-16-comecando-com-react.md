---
title: "React: criando seu primeiro componente"
date:   2016-09-16 21:00:00
tags: [react,javascript,es6,jsx]
category: javascript
layout: post
banner_image: react.png
---

O React dispensa apresentações logo não vou decorrer sobre os motivos de usar React. Neste post vou tentar sintetizar quais os primeiros passos pra usar o React no seu projeto e num post seguinte mostrar algumas notas de desenvolvimento que compilei na minha breve experiência com essa lib. 

<!--more-->

Como você provavelmente deve ter observado, no React existem "uns HTMLs no meio do javascript" que é o que chamamos de JSX, uma sintaxe usada pelo React e, como você provavelmente deve ter também imaginado, não roda no browser.

### Chamando seu amigo Gulp pra resolver o problema

Vamos transpilar o JSX pra JS e de quebra usar ES2015 também. Para isso, vamos primeiro instalar as dependências:

{% highlight shell %}
npm install -g gulp
npm install --save-dev gulp gulp-concat gulp-babel babel-preset-es2015 babel-preset-react
{% endhighlight %}

Eis a task:  
  
{% highlight js %}
//gulpfile.js
const gulp = require('gulp')
const concat = require('gulp-concat')
const babel = require('gulp-babel')

gulp.task('default', () => {
  gulp.src('assets/javascripts/components/**/*.jsx')
    .pipe(babel({
      presets: ['es2015', 'react']
    }))
    .pipe(concat('components.js'))
    .pipe(gulp.dest('assets/javascripts'))
})
{% endhighlight %}

Pra essa task acima assumimos a seguinte estrutura de diretórios:

    /assets
      -/javascripts
        -/components
        - components.js     

Nada muito complicado, você pode inclusive inserir esta task num projeto já existente e personalizar conforme suas necessidades.

### Escrevendo o primeiro componente

Agora que você já tem como transpilar JSX já podemos começar a escrever um pouco com o React:

{% highlight js %}
class MyNiceComponent extends React.component {
  
  constructor(props) {
    super(props)
  }
  
  render() {
    return (
      <div>Olá!</div>
    )
  }
  
}
{% endhighlight %}

Tendo o componente definido você pode agora renderizá-lo:

{% highlight js %}
ReactDOM.render(<MyNiceComponent />, document.querySelector('body'))
{% endhighlight %}

Esplêndido! Agora você já tem seu primeiro componente e as brumas da curiosidade começam a sumir. No próximo post vou reunir algumas notas de desenvolvimento com dicas pra lhe economizar algumas horas de pesquisa.
