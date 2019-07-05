import {addPackage} from 'pixi_fairygui';

import {spin, result} from './logic';

import {BigWin, Board, SlotMachine} from './components';

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

    BigWin(
        scene.getChildByName('bigWin'),
    );

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
