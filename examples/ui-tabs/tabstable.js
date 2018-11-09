import UIPlugin from 'rexTemplates/ui/ui-plugin.js';
import loki from 'rexPlugins/utils/lokijs/lokijs.min.js';

const Random = Phaser.Math.Between;

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;
class Demo extends Phaser.Scene {
    constructor() {
        super({
            key: 'examples'
        })
    }

    preload() {}

    create() {
        var db = createDataBase(400);

        var tabs = this.rexUI.add.tabs({
                x: 400,
                y: 300,

                panel: this.rexUI.add.gridTable({
                    background: this.rexUI.add.roundRectangle(0, 0, 20, 10, 10, COLOR_PRIMARY),

                    table: {
                        width: 250,
                        height: 400,

                        cellWidth: 120,
                        cellHeight: 60,
                        columns: 2,
                    },

                    slider: {
                        track: this.rexUI.add.roundRectangle(0, 0, 20, 10, 10, COLOR_DARK),
                        thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 13, COLOR_LIGHT),
                    },

                    createCellContainerCallback: function (cell) {
                        var scene = cell.scene,
                            width = cell.width,
                            height = cell.height,
                            item = cell.item,
                            index = cell.index;
                        return scene.rexUI.add.label({
                                width: width,
                                height: height,

                                background: scene.rexUI.add.roundRectangle(0, 0, 20, 20, 0).setStrokeStyle(2, COLOR_DARK),
                                icon: scene.rexUI.add.roundRectangle(0, 0, 20, 20, 10, item.color),
                                text: scene.add.text(0, 0, item.id),

                                space: {
                                    icon: 10,
                                    left: 15
                                }
                            })
                            .setOrigin(0)
                            .layout();
                    },
                }),

                leftButtons: [
                    createButton(this, 2, 'AA'),
                    createButton(this, 2, 'BB'),
                    createButton(this, 2, 'CC'),
                    createButton(this, 2, 'DD'),
                ],

                rightButtons: [
                    createButton(this, 0, '+'),
                    createButton(this, 0, '-'),
                ],

                space: {
                    leftButtonsOffset: 20,
                    rightButtonsOffset: 30,

                    leftButton: 1,
                },
            })
            .layout()
        //.drawBounds(this.add.graphics(), 0xff0000);

        tabs
            .on('button.click', function (button, groupName, index) {
                switch (groupName) {
                    case 'left':
                        // Highlight button
                        if (this._prevTypeButton) {
                            this._prevTypeButton.getElement('background').setFillStyle(COLOR_DARK)
                        }
                        button.getElement('background').setFillStyle(COLOR_PRIMARY);
                        this._prevTypeButton = button;
                        if (this._prevSortButton === undefined) {
                            return;
                        }

                        // Load items into grid table
                        loadItems(
                            this.getElement('panel'),
                            db,
                            this._prevTypeButton.text,
                            this._prevSortButton.text,
                        );
                        break;

                    case 'right':
                        // Highlight button
                        if (this._prevSortButton) {
                            this._prevSortButton.getElement('background').setFillStyle(COLOR_DARK)
                        }
                        button.getElement('background').setFillStyle(COLOR_PRIMARY);
                        this._prevSortButton = button;
                        if (this._prevTypeButton === undefined) {
                            return;
                        }

                        // Load items into grid table
                        loadItems(
                            this.getElement('panel'),
                            db,
                            this._prevTypeButton.text,
                            this._prevSortButton.text,
                        );
                        break;
                }
            }, tabs)

        tabs.emitButtonClick('left', 0).emitButtonClick('right', 0);
    }

    update() {}
}

var createDataBase = function (count) {
    var TYPE = ['AA', 'BB', 'CC', 'DD'];
    // Create the database
    var db = new loki();
    // Create a collection
    var items = db.addCollection('items');
    // Insert documents
    for (var i = 0; i < count; i++) {
        items.insert({
            type: TYPE[i % 4],
            id: i,
            color: Random(0, 0xffffff)
        });
    }
    return items;
};

var createButton = function (scene, direction, text) {
    var radius;
    switch (direction) {
        case 0: // Right
            radius = {
                tr: 20,
                br: 20
            }
            break;
        case 2: // Left
            radius = {
                tl: 20,
                bl: 20
            }
            break;
    }
    return scene.rexUI.add.label({
        width: 50,
        background: scene.rexUI.add.roundRectangle(0, 0, 50, 50, radius, COLOR_DARK),
        text: scene.add.text(0, 0, text, {
            fontSize: '18pt'
        }),
        space: {
            left: 10
        }
    });
}

var loadItems = function (table, db, type, sort) {
    var items = db
        .chain()
        .find({
            type: type
        })
        .simplesort('id', {
            desc: (sort === '-') // sort descending
        })
        .data();
    table.setItems(items);
}


var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: Demo,
    plugins: {
        scene: [{
            key: 'rexUI',
            plugin: UIPlugin,
            mapping: 'rexUI'
        }]
    }
};

var game = new Phaser.Game(config);