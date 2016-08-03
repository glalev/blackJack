import SpriteSheets from './data/SpriteSheets';

class Logo extends createjs.Sprite {
  constructor(spriteSheetName, pos) {
    const spriteSheet = new createjs.SpriteSheet(SpriteSheets[spriteSheetName]);
    super(spriteSheet, 'normal');
    this.set({ x: pos.x, y: pos.y , alpha: 0 });
  }

  setLabel(label) {
    if (this.curretAnimation === label) return;

    createjs.Tween.get(this)
      .to({ alpha: 0 }, 600, createjs.Ease.getPowIn(2))
      .call(this.gotoAndStop, [label])
      .to({ alpha: 1 }, 600, createjs.Ease.getPowIn(2))
  }
}

export default Logo;