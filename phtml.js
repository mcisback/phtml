const pHtml = {
    data: {
        name: 'Rabarbaro Marrone',
        bananas: [
            'one',
            'two',
            'three'
        ],
        todos: []
    }
}

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

        this.querySelector('input').value = pHtml.data[this.to]

        this.querySelector('input').addEventListener('input', (e) => {
            console.log('BindToElement e.target.value: ', e.target.value);

            pHtml.data[this.to] = e.target.value

            console.log(`BindToElement pHtml.data['${this.to}']: `, pHtml.data[this.to])
        })
    }
}

customElements.define('bind-to', BindToElement);
class ForElement extends HTMLElement {
    constructor() {
        super();

        this.from = this.getAttribute('from') * 1;

        console.log('ForElement from: ', this.from);

        this.to = this.getAttribute('to') * 1;

        console.log('ForElement to: ', this.to);

        this.step = this.getAttribute('step') * 1;

        console.log('ForElement step: ', this.step);

        this.initialInnerHtml = this.innerHTML;
        this.innerHTML = '';

        console.log('ForElement initial innerHTML: ', this.initialInnerHtml);
    }

    connectedCallback() {
        console.log(`ForElement pHtml.data['${this.from}']: `, this.from)
        console.log(`ForElement pHtml.data['${this.to}']: `, this.to)

        for(let i = this.from; i < this.to; i += this.step) {
            console.log(i)

            this.innerHTML += this.initialInnerHtml.replaceAll(`{counter}`, i);
        }
    }
}

customElements.define('for-loop', ForElement);

class ForEachElement extends HTMLElement {
    constructor() {
        super();

        this.source = this.getAttribute('source');

        console.log('ForEachElement source: ', this.source);

        this.as = this.getAttribute('as');

        console.log('ForEachElement as: ', this.as);

        this.initialInnerHtml = this.innerHTML;

        console.log('ForEachElement initial innerHTML: ', this.initialInnerHtml);
    }

    connectedCallback() {
        console.log(`ForEachElement pHtml.data['${this.source}']: `, pHtml.data[this.source])

        this.innerHTML = '';

        pHtml.data[this.source].forEach(el => {
            console.log(this.as, el)
            
            this.innerHTML += this.initialInnerHtml.replaceAll(`{${this.as}}`, el);
        })
    }
}

customElements.define('foreach-loop', ForEachElement);

class JsonGetElement extends HTMLElement {
    constructor() {
        super();

        this.endpoint = this.getAttribute('endpoint');

        console.log('JsonGetElement endpoint: ', this.endpoint);

        this.target = this.getAttribute('target');

        console.log('JsonGetElement target: ', this.target);

        if(this.innerHTML) {
            this.initialInnerHtml = this.innerHTML;
            this.innerHTML = '';
        }

        console.log('JsonGetElement initial innerHTML: ', this.initialInnerHtml);
    }

    connectedCallback() {
        fetch(this.endpoint, {
            headers: {
              'Accept': 'application/json'
            }
        })
        .then(res => res.json())
        .then(response => {
            pHtml.data[this.target] = response

            console.log(`JsonGetElement pHtml.data['${this.target}']: `, pHtml.data[this.target])

            if(this.innerHTML) {
                this.innerHTML = this.initialInnerHtml;
            }
        })
        .catch(err => {
            this.innerHTML = 'Error'
        });
    }
}

customElements.define('json-get', JsonGetElement);

class JsonLoopElement extends HTMLElement {
    constructor() {
        super();

        this.endpoint = this.getAttribute('endpoint');

        console.log('JsonLoopElement endpoint: ', this.endpoint);

        this.target = this.getAttribute('target');

        console.log('JsonLoopElement target: ', this.target);

        if(this.innerHTML) {
            this.initialInnerHtml = this.innerHTML;
            this.innerHTML = '';
        }

        console.log('JsonLoopElement initial innerHTML: ', this.initialInnerHtml);
    }

    connectedCallback() {
        fetch(this.endpoint, {
            headers: {
              'Accept': 'application/json'
            }
        })
        .then(res => res.json())
        .then(response => {
            this.response = response

            console.log(`JsonLoopElement this.response: `, this.response)

            let innerHtml = this.initialInnerHtml

            this.response.forEach(el => {
                console.log(this.target, el)

                const reg = /\{([^}]+)\}/g;
                let result;
                let finalValue = el
                let jsonPath = this.target

                console.log('JsonLoopElement finalValue start: ', finalValue);

                while ((result = reg.exec(innerHtml)) !== null) {
                    console.log('JsonLoopElement result: ', result[1]);

                    jsonPath = result[1];

                    const parts = jsonPath.split(".");

                    console.log('JsonLoopElement parts: ', parts);

                    parts.shift();

                    console.log('JsonLoopElement parts shifted: ', parts);

                    finalValue = el

                    parts.forEach(function(key){
                        console.log(`JsonLoopElement finalValue[${key}]: `, finalValue[key]);
                        finalValue = finalValue[key];
                    });

                    console.log('JsonLoopElement finalValue: ', finalValue);
                }

                console.log('jsonPath: ', jsonPath);
                
                innerHtml = innerHtml.replaceAll(`{${jsonPath}}`, finalValue)

                this.innerHTML += innerHtml;
            })
        })
        .catch(err => {
            this.innerHTML = 'Error'
        });
    }
}

customElements.define('json-loop', JsonLoopElement);