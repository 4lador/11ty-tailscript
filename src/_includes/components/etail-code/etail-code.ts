import { clipBoardService } from '../../../services/clipboard.service';

class TailscriptCodeViewerComponent extends HTMLElement {
    codeArea: HTMLElement;
    copyBtn: HTMLElement;
    methods: { [x: string]: Function };

    constructor() {
        super();
    }

    connectedCallback() {
        setTimeout(() => {
            this.codeArea = this.querySelector('code') as HTMLElement;
            this.copyBtn = this.querySelector('#copyBtn') as HTMLElement;

            this.methods = {
                copyToClipboard: this.copyToClipboard.bind(this),
            };

            this.addEventListener('click', this.handleClick);
        });
    }

    copyToClipboard(event: MouseEvent) {
        event.preventDefault();

        if (event === null || !(event.target instanceof HTMLElement)) {
            throw new Error('Invalid target');
        }

        const target: HTMLElement | null = event.target;

        const text = target.innerText;
        clipBoardService.copy(text);

        this.handleCopiedTransition();
    }

    handleCopiedTransition() {
        const btn = this.copyBtn;
        btn.classList.toggle('copied');

        setTimeout(() => btn.classList.toggle('copied'), 1500);
    }

    handleClick(event: Event) {
        if (event !== null && event.target instanceof HTMLElement) {
            let target: HTMLElement | null = event.target;

            while (target && !target.dataset.onclick) {
                target = target.parentElement;
            }

            if (target && target.dataset.onclick) {
                const method = this.methods[target.dataset.onclick];

                if (method) {
                    method(event);
                }
            }
        }
    }
}

window.customElements.define('etail-code', TailscriptCodeViewerComponent);
