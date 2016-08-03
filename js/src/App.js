import StateMachine from '../lib/StateMachine';
import Game  from './Game';

var game = new Game(new createjs.Stage('canvas'));

StateMachine.create({
  target: game,
  events: [
    { name: 'startup', from: 'none', to: 'load' },
    { name: 'start', from: 'load', to: 'starting' },
    { name: 'deal', from: 'starting', to: 'dealing' },
    { name: 'idle', from: ['dealing', 'redealing'], to: 'waiting' },
    { name: 'redeal', from: 'waiting', to: 'redealing' },
    { name: 'end', from: 'redealing', to: 'over' }
  ]
});

game.startup();