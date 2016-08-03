import SpriteSheets from './data/SpriteSheets';

class Button extends createjs.Sprite {

  constructor(spriteSheetName, pos) {
    const spriteSheet = new createjs.SpriteSheet(SpriteSheets[spriteSheetName]);
    super(spriteSheet);
    this.set({ x: pos.x, y: pos.y });
    this.helper = new createjs.ButtonHelper(this);
  }

  disable() {
    this.helper.enabled = false;
    this.gotoAndStop('disable');
    this.mouseEnabled = false;
  }

  enable() {
    //ButtonHelper it is not particularly helpful in case you want to play custom animation,
    //so a little workaround is needed
    const p = this.globalToLocal(this.stage.mouseX, this.stage.mouseY);
    const isOver = this.hitTest(p.x, p.y);
    const label = isOver ? 'over' : 'out';

    this.gotoAndStop(label);
    this.helper._isOver = isOver;
    this.helper._isPressed = false;
    this.helper.enabled = true;
    this.mouseEnabled = true;
  }
}


export default Button;