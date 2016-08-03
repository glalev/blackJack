/*
*  Configuration data for all the classes
* */
const Config = {
  deck: {
    position: {
      landscape: { x: 1025, y: 355 },
      portrait: { x: 378, y: 860 }
    },
    shuffle: {
      dev: 2, // 
      duration: 150,
      dx: {
        min: 20,
        max: 60
      },
      dy: {
        min: -5,
        max: 5
      }
    },

    cards: {
      faces: [
      'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10', 'cj', 'cq', 'ck', 'ca',
      'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8', 'd9', 'd10', 'dj', 'dq', 'dk', 'da',
      'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8', 'h9', 'h10', 'hj', 'hq', 'hk', 'ha',
      's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10', 'sj', 'sq', 'sk', 'sa'
      ],

      config: {
        back: 'back',
        shadow: new createjs.Shadow("#2e333c", 2, 2, 8),
        dx: 0.25, 
        dy: -0.15
      }
    }
  },

  playerZone: {
    position: {
      landscape: { x: 380, y: 460 },
      portrait: { x: 233, y: 557 }
    },
    options: {
      places: 2,
      width: 145,
      removeAnimation: {
        dx: {
          min: 500,
          max: 800
        },
        dy: {
          min: -500,
          max: -300
        },
        rotation: {
          min: 125,
          max: 275
        },
        duration : 1000
      }
    }
  },

  dealerZone: {
    position: {
      landscape: { x: 235, y: 268 },
      portrait: { x: 88, y: 365 }
    },
    options: {
      places: 3,
      width: 145
    }
  },

  logo: {
    position: {
      landscape: { x: 532, y: 20 },
      portrait: { x: 240, y: 50 }
    }

  },

  endLogo: {
    position: {
      landscape: { x: 532, y: 20 },
      portrait: { x: 240, y: 20 }
    }

  },

  hitButton: {
    position: {
      landscape: { x: 993, y: 560 },
      portrait: { x: 346, y: 1050 }
    }
  },

  stage: {
    size: {
      landscape: { width: 1280, height: 720 },
      portrait: { width: 720, height: 1280 }
    }
  }

};

export default Config;
