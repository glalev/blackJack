import _ from 'lodash';

/*
* DealZone - place /part of the stage/ where a card can be dealt
* */
class DealZone extends createjs.Container {
  constructor(pos, cfg) {
    super();

    this.cards = new createjs.Container();
    this.set({ x: pos.x, y: pos.y, cfg: cfg });
    this.resetPlaces();
    this.addChild(this.cards);
  }

  static get events() {
    return {
      CARDS_REMOVED: 'cards_removed'
    };
  }

  //a place contains coordinates from the zone where a card can be placed
  getPlacePosition(place) {
    if (_.isArray(place)) return _.map(place, this.getPlacePosition.bind(this));

    return this.map[place];
  }

  //ads a card to the zone
  addCard(card, position) {
    if (!this.map[position] || !this.map[position].empty) return console.error(`cannot add card at position: ${ position }`);

    const pos = this.getPlacePosition(position);
    this.cards.addChild(card);
    this.map[position].empty = false;

    card.set({ x: pos.x, y: pos.y });
  }

  //remove cards from the zone and playing end animation
  removeCards(cards = this.cards.children) {
    cards = [].concat(cards); //in case one card is past
    let i = 0;
    const cfg = this.cfg.removeAnimation;
    const onCardRemove = (card) => {
      this._killCard(card);
      if (++i === cards.length) this.dispatchEvent(DealZone.events.CARDS_REMOVED);
    };

    _.each(cards, card => {
      const x = card.x > 0 ? _.random(cfg.dx.min, cfg.dx.max) : -1 * _.random(cfg.dx.min, cfg.dx.max);
      const y = _.random(cfg.dy.min, cfg.dy.max);
      const rotation = _.random(cfg.rotation.min, cfg.rotation.max);

      createjs.Tween.get(card)
        .to({ x: x, y: y, rotation: rotation, alpha: 0 }, cfg.duration, createjs.Ease.getPowOut(2))
        .call(onCardRemove, [card]);
    });
  }
  //add place where a card can be dealt, to the zone
  addPlace(x, y) {
    const place = { x: x, y: y, empty: true };

    this.map.push(place);
  }
  //returns all empty positions in the DealZone
  getFreePlaces() {
    return _.reduce(this.map, (acc, v, i) => {
      return (v.empty) ? acc.concat(i) : acc;
    }, []);
  }

  //reset the zone places/where a card can be put/ to their initial state
  resetPlaces() {
    this.map = _.times(this.cfg.places, (i) => {
      return { x: i * this.cfg.width, y: 0, empty: true };
    });
  }

  //removes a card from the deal zone
  _killCard(card) {
    const index = this.cards.getChildIndex(card);
    this.cards.removeChild(card);
    this.map[index].empty = true;
  }
}

export default DealZone;