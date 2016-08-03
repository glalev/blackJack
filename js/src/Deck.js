import Card from './Card';
import _ from 'lodash';

class Deck extends createjs.Container {
  constructor(pos, cfg) {
    super();

    this.set({ x: pos.x, y: pos.y, cardCfg: cfg.cards.config, shuffleCfg: cfg.shuffle });
    const faces = (cfg.shuffle) ? _.shuffle(cfg.cards.faces) : cfg.cards.faces;
    faces.forEach(this._addCard.bind(this));
  }

  static get events() {

    return {
      SHUFFLE_END: 'shuffle_end',
      CARD_DEALT: 'card_dealt',
      DEAL_END: 'deal_end'
    };
  }

  get length() {
    return this.children.length;
  }

  //plays the shuffle animation 'times' times
  shuffle(times) {
    if (times === 0) return this.dispatchEvent(Deck.events.SHUFFLE_END);

    //shuffles z indexes of the cards
    const shuffleIndexes = () => {
      this.children.forEach((card, i) => {
        const dev = this.shuffleCfg.dev;
        let pos = i % 2 === 0 ? i + dev : i - dev;
        this.setChildIndex(card, pos);
      });
    };

    //returns all card to their natural position in the deck
    const tweenBack = (i) => {
      if (i !== 0)return;
      this.children.forEach((card, i) => {
        createjs.Tween.get(card)
          .to({ x: i * this.cardCfg.dx, y: i * this.cardCfg.dy }, this.shuffleCfg.duration, createjs.Ease.getPowIn(2))
          .call(onShuffleEnd, [i]);
      });
    };

    const onShuffleEnd = (i) => {
      if (i === 0) this.shuffle(--times);
    };

    this.children.forEach((card, i) => {
      const dx = _.random(this.shuffleCfg.dx.max, this.shuffleCfg.dx.min);
      const y1 = _.random(this.shuffleCfg.dy.max, this.shuffleCfg.dy.min);
      const x1 = i % 2 === 0 ? card.x + dx : card.x - dx;

      createjs.Tween.get(card)
        .to({ x: x1, y: y1 }, this.shuffleCfg.duration, createjs.Ease.getPowIn(2))
        .call(shuffleIndexes)
        .call(tweenBack, [i]);
    });
  }

  //deals a card or cards to specified position/s
  deal(options) {
    if (!this.children.length) return console.error('You can\'t deal from empty deck');

    const option = _.isArray(options) ? options.shift() : options;
    const card = _.last(this.children);
    const dx = Math.pow(card.x - option.x, 2);
    const dy = Math.pow(card.y - option.y, 2);
    const duration = Math.sqrt(dx + dy) * 0.5;

    const onDealEnd = (card, options) => {
      const e = new createjs.Event(Deck.events.CARD_DEALT);
      e.card = card;
      //when a card is dealt is removed from the deck, and hopefully added to a dealzone
      this.removeChild(card);
      this.dispatchEvent(e);

      if (_.isArray(options) && options.length) return this.deal(options);

      this.dispatchEvent(Deck.events.DEAL_END);
    };

    card.setShadow();
    createjs.Tween.get(card)
      .to({ x: option.x, y: option.y }, duration, createjs.Ease.getPowOut(2))
      .call(card.flip)
      .call(onDealEnd, [card, options]);
  }

  _addCard(face, i) {
    const cfg = this.cardCfg;
    const card = new Card(face, cfg);
    this.addChild(card);
    card.set({ x: i * cfg.dx, y: i * cfg.dy });

  }
}

export default Deck;