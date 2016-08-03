class Resizer extends createjs.EventDispatcher {
  constructor(stage, cfg) {
    super();
    this.stage = stage;
    this.cfg = cfg;
    this.mode = null;
    window.addEventListener('resize', this.resize.bind(this), false);
  }

  static get events() {
    return {
      MODE_CHANGE: 'mode_change'
    };
  }

  static getMode() {
    return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
  }

  resize() {
    const mode = Resizer.getMode();
    mode === 'landscape' ? this._resizeLandscape() : this._resizePortrait();

    if (this.mode !== mode) {
      const e = new createjs.Event(Resizer.events.MODE_CHANGE);
      this.mode = e.mode = mode;
      this.dispatchEvent(e);
    }
  }

  _resizeLandscape() {
    const w = this.cfg.landscape.width;
    const h = this.cfg.landscape.height;
    const ratio = w / h;

    if (window.innerWidth < w) {
      let scale = window.innerWidth / w;
      this.stage.canvas.width = window.innerWidth;
      this.stage.canvas.height = window.innerWidth / ratio;
      this.stage.scaleX = this.stage.scaleY = scale;
    }

    if (window.innerHeight < this.stage.canvas.height) {
      let scale = window.innerHeight / h;
      this.stage.canvas.width = window.innerWidth * ratio;
      this.stage.canvas.height = window.innerHeight;
      this.stage.scaleX = this.stage.scaleY = scale;
    }
  }

  _resizePortrait() {
    const w = this.cfg.portrait.width;
    const h = this.cfg.portrait.height;
    const ratio = h / w;

    if (window.innerHeight < h) {
      let scale = window.innerHeight / h;
      this.stage.canvas.height = window.innerHeight;
      this.stage.canvas.width = window.innerHeight / ratio;
      this.stage.scaleX = this.stage.scaleY = scale;
    }

    if (window.innerWidth < this.stage.canvas.width) {
      let scale = window.innerWidth / w;
      this.stage.canvas.width = window.innerWidth;
      this.stage.canvas.height = window.innerHeight * ratio;
      this.stage.scaleX = this.stage.scaleY = scale;
    }
  }
}

export default Resizer;