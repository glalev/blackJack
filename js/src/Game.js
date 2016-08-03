import Deck from './Deck';
import DealZone from './DealZone';
import Button from './Button';
import Logo from './Logo';
import Resizer from './Resizer';
import assets from './Assets';
import config from './data/Config';

class Game {

  constructor(stage) {
    this.stage = stage;
    this.listeners = {};
    this.mode = null;
  }

  onload() {
    const loader = new createjs.LoadQueue();
    loader.loadManifest(assets.manifest);

    const loadListener = loader.on('fileload', e => assets.images[e.item.name] = e.result);
    const errorListener = loader.on('error', e => console.error(e), this, true);

    loader.on('complete', () => {
      loader.off('fileload', loadListener);
      loader.off('error', errorListener);
      this.start();
    }, this, true);
  }

  onstarting() {
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.on('tick', this.stage);

    this.resizer = new Resizer(this.stage, config.stage.size);
    this.resizer.on(Resizer.events.MODE_CHANGE, e => this._setMode(e.mode));
    this.resizer.resize();
    this.background = new createjs.Bitmap(assets.images[this.mode]);
    this.logo = new Logo('logo', config.logo.position[this.mode]);
    this.dealerZone = new DealZone(config.dealerZone.position[this.mode], config.dealerZone.options);
    this.playerZone = new DealZone(config.playerZone.position[this.mode], config.playerZone.options);
    this.deck = new Deck(config.deck.position[this.mode], config.deck);
    this.hitButton = new Button('hitButton', config.hitButton.position[this.mode]);

    this.stage.addChild(this.background, this.logo, this.dealerZone, this.playerZone, this.deck, this.hitButton);
    this.deal();
  }

  ondealing() {

    this.logo.setLabel('normal');
    this.deck.shuffle(3);
    this.deck.on(Deck.events.SHUFFLE_END, ()=> {
      this._dealOnZone(this.dealerZone, () => {
        this._dealOnZone(this.playerZone, this.idle, this);
      }, this);
    }, this, true);
  }

  onbeforeidle() {
    this.stage.enableMouseOver();
    this.hitButton.enable();
  }

  onwaiting() {
    this.listeners.hit && this.hitButton.off('click', this.listeners.hit);
    this.listeners.hit = this.hitButton.on('click', ()=> {
      this.playerZone.removeCards();
      this.hitButton.disable();
      this.playerZone.on(DealZone.events.CARDS_REMOVED, () => {
        this.playerZone.resetPlaces();
        this.redeal();
      }, this, true);
    }, this, true);

    const cards = this.playerZone.cards.children;

    cards.forEach(card => {
      if (card.hasLister || card.currentAnimation === 'back') return;
      card.hasLister = true;
      card.cursor = "pointer";
      card.on('click', e => {
        const card = e.currentTarget;
        card.cursor = "arrow";
        card.flip();
        this.hitButton.disable();
        this.playerZone.addPlace(card.x, card.y + 5);
        setTimeout(this.redeal.bind(this), 150);
      }, this, true);
    });
  }

  onleavewaiting() {
    this.stage.enableMouseOver(0);
  }

  onredealing() {
    this._dealOnZone(this.playerZone, () => {
      this.deck.length ? this.idle() : this.end();
    }, this);
  }

  onover() {
    this.logo.setLabel('gameOver');
  }

  onenterstate() {
    console.log('==========================================');
    console.log(`CURRENT STATE: ${this.current}`);

  }

  _dealOnZone(zone, callback, context) {
    const freePos = zone.getFreePlaces();
    const slice = Math.min(this.deck.length, freePos.length);
    const pos = zone.getPlacePosition(freePos)
      .map(p => zone.cards.localToLocal(p.x, p.y, this.deck))
      .slice(0, slice);

    this.deck.deal(pos);

    const cardListener = this.deck.on(Deck.events.CARD_DEALT, e => {
      const i = zone.cards.children.length;
      zone.addCard(e.card, i);
    });

    this.deck.on(Deck.events.DEAL_END, () => {
      this.deck.off(Deck.events.CARD_DEALT, cardListener);
      callback.call(context);
    }, this, true);
  }

  _setMode(mode) {
    if (this.mode === null) return this.mode = mode; //handle the fist call, at the start of the game

    this.mode = mode;
    this.stage.removeChild(this.background);
    this.background = new createjs.Bitmap(assets.images[mode]);
    this.stage.addChildAt(this.background, 0);

    ['logo', 'dealerZone', 'playerZone', 'deck', 'hitButton'].forEach((name) => {
      const pos = config[name].position[mode];
      this[name] && this[name].set({ x: pos.x, y: pos.y });
    });
  }
}

export default Game;