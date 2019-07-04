import {addPackage} from 'pixi_fairygui';
import {SlotMachine} from './components/slot';

import {extras} from 'pixi.js';

const {BitmapText} = extras;

import {spin, result} from './logic';

function Board(view) {
    const scores =
        view.children
            .filter(({name}) => name && name.includes('pos'))
            .map(({name, x, y}) => {
                const style =
                    (name.includes('jackpot')) ?
                        {font: '30px Score'} : {font: '30px Score'};

                const score =
                    new BitmapText('$120,640,000', style);

                score.position.set(x, y);

                if (!name.includes('jackpot')) score.scale.set(0.9, 0.8);

                return score;
            });

    view.addChild(...scores);
}

export function create({normalTable}) {
    const create = addPackage(app, 'main');
    const scene = create('MainScene');

    const slot = SlotMachine({
        view: scene,
        tables: normalTable,
    });

    Board(
        scene.getChildByName('board'),
    );

    const effects =
        scene.children
            .filter(({name}) => name && name.includes('effect'))
            .sort((a, b) => id(a) - id(b));

    window.slot = slot;
    window.play = play;

    return scene;

    async function play(icons) {
        await spin(slot.reels, icons);

        result(effects, icons);
    }
}

function id({name}) {
    return Number(name.split('@')[1]);
}
