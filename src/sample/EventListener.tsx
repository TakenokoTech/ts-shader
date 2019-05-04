class EventInstance {
    mouseX = 0;
    mouseY = 0;

    sliderMap: { [key: string]: HTMLInputElement } = {};

    constructor() {
        this.setupMouse = this.setupMouse.bind(this);
        this.setupInput = this.setupInput.bind(this);
        this.setupMouse();
        this.setupInput();
    }

    public get mouse() {
        return { x: this.mouseX, y: this.mouseY };
    }

    public param(name: string): string {
        return this.sliderMap[name].value;
    }

    private setupMouse() {
        const self = this;
        document.body.addEventListener("mousemove", e => {
            self.mouseX = e.pageX;
            self.mouseY = e.pageY;
        });
    }

    private setupInput() {
        const self = this;
        const slider = document.body.querySelectorAll("[type=range]");
        const text = document.body.querySelectorAll("[type=text]");
        const concat = ([] as Element[]).concat(Array.from(slider), Array.from(text));
        for (const s of concat) {
            const name = (s as HTMLInputElement).dataset.name;
            const el = document.body.querySelector(`#${name}`);
            if (name) this.sliderMap[name] = s as HTMLInputElement;

            const e = () => {
                const val = (s as HTMLInputElement).value;
                if (el) el.innerHTML = val;
            };
            s.addEventListener("input", e, false);
            s.addEventListener("change", e, false);
        }
    }
}

export default new EventInstance();
