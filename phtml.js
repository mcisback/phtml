const pHtml = {
    data: {
        name: 'ciao'
    }
}

let name = 'ciao'

window.name = name

const bananas = [
    'one',
    'two',
    'three'
]

window.bananas = bananas

class IfBlockElement extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        if(eval(this.getAttribute('expr'))) {
            this.innerHTML = 'true'
        } else {
            this.innerHTML = 'false'
        }
    }
}

customElements.define('if-block', IfBlockElement);

class BindToElement extends HTMLElement {
    constructor() {
        super();

        this.to = this.getAttribute('to');

        console.log('BindToElement to: ', this.to);
    }

    connectedCallback() {
        console.log('Child Input: ', this.querySelector('input'))

        this.querySelector('input').addEventListener('input', (e) => {
            console.log('BindToElement e.target.value: ', e.target.value);

            window[this.to] = e.target.value

            console.log(`BindToElement window['${this.to}']: `, window[this.to])
        })
    }
}

customElements.define('bind-to', BindToElement);

class ForEachElement extends HTMLElement {
    constructor() {
        super();

        this.source = this.getAttribute('source');

        console.log('ForEachElement source: ', this.source);

        this.as = this.getAttribute('as');

        console.log('ForEachElement as: ', this.as);

        this.initialInnerHtml = this.innerHTML;
        this.innerHTML = '';

        console.log('ForEachElement initial innerHTML: ', this.initialInnerHtml);
    }

    connectedCallback() {
        console.log(`ForEachElement window['${this.source}']: `, window[this.source])

        window[this.source].forEach(el => {
            console.log(this.as, el)

            this.innerHTML += this.initialInnerHtml.replaceAll(`{${this.as}}`, el);
        })
    }
}

customElements.define('foreach-loop', ForEachElement);