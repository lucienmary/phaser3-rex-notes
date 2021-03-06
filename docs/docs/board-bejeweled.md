## Introduction

Match3-like gameplay template.

- Author: Rex
- Template

## Live demo

- [Default](https://codepen.io/rexrainbow/pen/wEVYoY)
- [Custom input](https://codepen.io/rexrainbow/pen/XWWyELV)

## Usage

[Sample code](https://github.com/rexrainbow/phaser3-rex-notes/tree/master/examples/board-bejeweled)

### Install plugin

#### Load minify file

- Load rexBoard plugin (minify file) in preload stage
    ```javascript
    scene.load.scenePlugin('rexboardplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexboardplugin.min.js', 'rexBoard', 'rexBoard');
    scene.load.script('rexbejeweled', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexbejeweled.min.js');
    ```
- Add bejeweled object
    ```javascript
    var bejeweled = new rexbejeweled(scene, config);
    ```

#### Import template

- Install rex plugins from npm
    ```
    npm i phaser3-rex-plugins
    ```
- Install rexBoard plugin in [configuration of game](game.md#configuration)
    ```javascript
    import BoardPlugin from 'phaser3-rex-plugins/plugins/board-plugin.js';
    import Bejeweled from 'phaser3-rex-plugins/templates/bejeweled/Bejeweled.js';

    var config = {
        // ...
        plugins: {
            scene: [{
                key: 'rexBoard',
                plugin: BoardPlugin,
                mapping: 'rexBoard'
            },
            // ...
            ]
        }
        // ...
    };
    var game = new Phaser.Game(config);
    ```
- Add bejeweled object
    ```javascript
    var bejeweled = new Bejeweled(scene, config);
    ```

### Create bejeweled object

```javascript
var bejeweled = new Bejeweled(scene, {
    // rexBoard: 'rexBoard',

    board: {
        grid: {
            gridType: 'quadGrid',
            x: 30,
            y: 30 - 600,
            cellWidth: 60,
            cellHeight: 60,
            type: 'orthogonal' // 'orthogonal'|'isometric'
        },
        width: 10,
        height: 20 // Prepared rows: upper 10 rows
    },
    match: {
        // wildcard: undefined
        // dirMask: undefined
    },
    chess: {
        // pick random symbol from array, or a callback to return symbol
        symbols: [0, 1, 2, 3, 4, 5],
        // symbols: function(board, tileX, tileY, excluded) { return symbol; }

        // User-defined chess game object
        create: function (board) {
            // Create Game object (Shape, Image, or Sprite)
            var scene = board.scene;
            var gameObject = scene.add.sprite(0, 0, textureKey, frame);
            // Initial 'symbol' value
            gameObject.setData('symbol', undefined);
            // Add data changed event of 'symbol` key
            gameObject.data.events.on('changedata_symbol', function (gameObject, value, previousValue) {
                // Change the appearance of game object via new symbol value
                gameObject.setFrame(newFrame);
            });
            return gameObject;
        },

        // scope for callbacks
        scope: undefined,

        // moveTo behavior
        moveTo: {
            speed: 400
        },
        // tileZ: 1,
    },

    // callback of matched lines
    onMatchLinesCallback: function (lines, board) {
    },
    onMatchLinesCallbackScope: undefined,

    // callback of eliminating chess
    onEliminatingChessCallback: function (chess, board) {
        // return eventEmitter; // custom eliminating task, fires 'complete' event to continue FSM
    },
    onEliminatingChessCallbackScope: undefined,

    // callback of falling chess
    onFallingChessCallback: function (board) {
        // return eventEmitter; // custom falling task, fires 'complete' event to continue FSM
    },
    onFallingChessCallback: undefined,

    // input: true
})
```

Configurations

- `rexBoard` : Key of 'rexBoard' plugin. Default is `'rexBoard'`.
- Board properties
    - `board.width` : Board width in tiles.
    - `board.height` : [Board height](board-bejeweled.md#board-height) in tiles.
    - `board.grid.x`, `board.grid.y` : World position of tile (0, 0)
    - `board.grid.cellWidth`, `board.grid.cellHeight` : The width/height of the cell, in pixels.
- Chess properties
    - `chess.symbols` : An array of possible symbols, or a callback to return a symbol. See [Generate symbol](board-bejeweled.md#generate-symbol)
    - `chess.create`, `chess.scope` : Callback of [creating chess object](board-bejeweled.md#create-chess-object).
    - `chess.moveTo.speed` : Constant moving speed of chess, in pixel per-second.
- Callbacks
    - `onMatchLinesCallback`, `onMatchLinesCallbackScope` : [On matched lines](board-bejeweled.md#on-matched-lines)
    - `onEliminatingChessCallback`, `onEliminatingChessCallbackScope` : [On eliminating chess](board-bejeweled.md#on-eliminating-chess)
    - `onFallingChessCallback`, `onFallingChessCallback` : [On falling chess](board-bejeweled.md#on-falling-chess)
- Touch input
    - `input` : Set `true` to register default touch input logic.

It also install [Board plugins](board.md) into Game system.

#### Board height

Board is separated into two parts: upper and bottom

- Bottom : **Visible N rows**, to swap chess and run matching.
- Upper : **Invisible N rows**, chess in these rows will move down, to fill bottom rows.

For example, if amount of visible rows is `10`, `board.height` should set to `20`.

#### Generate symbol

Symbols are declared in property `chess.symbols` in a symbol array like `[0, 1, 2, 3, 4, 5]`, or a callback to return a symbol. The callback also use `chess.scope` as the scope.

```javascript
function(board, tileX, tileY, excluded) {
    return symbol
}
```

- `excluded` : `undefined` or a symbol array. Don't return these symbols.

#### Create chess object

Return a game object from a callback.

```javascript
function(board) {
    // Create Game object (Image, Sprite, or Shape)
    var scene = board.scene;
    var gameObject = scene.add.sprite(0, 0, textureKey, frame);
    // Initial 'symbol' value
    gameObject.setData('symbol', undefined);
    // Add data changed event of 'symbol` key
    gameObject.data.events.on('changedata_symbol', function (gameObject, value, previousValue) {
        // Change the appearance of game object via new symbol value
        gameObject.setFrame(newFrame);
    });
    return gameObject;
}
```

Each chess has a `symbol` value stored in `'symbol'` key in private data. Add data changed event of 'symbol` key to change the appearance of game object via new symbol value.

#### Callbacks

##### On matched lines

```javascript
function(lines, board) {

}
```

- `lines` : An array of matched lines, each line is a [built-in Set object](structs-set.md).
    - Length of each line (`lines[i].size`) could be *5*, *4*, or *3*.
    - `lines[i].entries` : An array of chess (Game Object) in a matched line.
    - All chess game objects in matched lines will be eliminated in next stage. Add/remove chess game object in these lines, or add new line in `lines` array to change the eliminated targets.
- `board` : [Board object](board.md).
    - Get tile position `{x,y,z}` of a chess game object via
        ```javascript
        var tileXYZ = gameObject.rexChess.tileXYZ;
        ```
    - Get chess game object of a tile position `{x,y,z}` via
        ```javascript
        var gameObject = board.tileXYZToChess(tileX, tileY, tileZ);
        ```
    - Get array of neighbor chess of a chess game object via
        ```javascript
        var gameObjects = board.getNeighborChess(chess, null);
        ```

Use cases:

- Get cross chess of two lines via `lineA.intersect(lineB)`.
- Add chess into line(s) to eliminate more chess.

##### On eliminating chess

```javascript
function(chessArray, board) {
    // return eventEmitter; // custom eliminating task, fires 'complete' event to continue FSM
}
```

- `chessArray` : An array of chess (Game Object) to be eliminated
- `board` : [Board object](board.md)

Use csees:

- Accumulate scores via amount of eliminated chess

##### On falling chess

### Start gameplay

```javascript
bejeweled.start();
```

### Input control

#### Default input

1. Enable default input control
    ```javascript
    var bejeweled = new Bejeweled(scene, {
        // ...
        input: true
    });
    ```
1. Enable/disable temporarily.
    - Enable
        ```javascript
        bejeweled.setInputEnable();
        ```
    - Disable
        ```javascript
        bejeweled.setInputEnable(false);
        ```

#### Custom input

1. Discard default input control
    ```javascript
    var bejeweled = new Bejeweled(scene, {
        // ...
        input: false
    });
    ```
1. Add custom input logic like
    ```javascript
    scene.input
        .on('pointerdown', function (pointer) {
            var chess = bejeweled.worldXYToChess(pointer.worldX, pointer.worldY);
            if (chess) {
                bejeweled.selectChess1(chess);
            }
        }, scene)
        .on('pointermove', function (pointer) {
            if (!pointer.isDown) {
                return;
            }
            var chess = bejeweled.worldXYToChess(pointer.worldX, pointer.worldY);
            if (chess && (chess !== this.bejeweled.selectedChess1)) {
                bejeweled.selectChess2(chess);
            }
        }, scene);
    ```

Helper methods

- Get chess via worldXY position
    ```javascript
    var chess = bejeweled.worldXYToChess(worldX, worldY);
    ```
- Get chess via tileXY position
    ```javascript
    var chess = bejeweled.tileXYToChess(tileX, tileY);
    ```
- Get neighbor chess via angle
    ```javascript
    var chess2 = bejeweled.getNeighborChessAtAngle(chess1, angle);
    ```
    - `chess1` : Chess object, or tileXY position `{x, y}`.
    - `angle` : Angle in radius.
- Get neighbor chess via direction
    ```javascript
    var chess2 = bejeweled.getNeighborChessAtDirection(chess1, direction);
    ```
    - `chess1` : Chess object, or tileXY position `{x, y}`.
    - `direction` : Number, or string number.
        - `0` ~ `3` : [Quad grid](board-quadgrid.md#directions) in 4 directions mode.
        - `0` ~ `7` : [Quad grid](board-quadgrid.md#directions) in 8 directions mode.
        - `0` ~ `5` : [Hexagon grid](board-hexagongrid.md#directions).