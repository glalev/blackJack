import SpriteSheets from './data/SpriteSheets';

class Card extends createjs.Sprite {
  constructor(face, cfg) {
    const spriteSheet = new createjs.SpriteSheet(SpriteSheets.card);

    super(spriteSheet, cfg.back);
    this.face = face;
    this.cfg = cfg;
  }

  flip() {
    var flip = this.currentAnimation === this.cfg.back ? this.face : this.cfg.back;

    this.gotoAndStop(flip);
  }

  setShadow() {
    this.shadow = this.cfg.shadow;
  }
}

export default Card;