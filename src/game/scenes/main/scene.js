import {addPackage} from 'pixi_fairygui';

import {Background, BigWin, SlotMachine} from './components';

import {logic} from './logic';

export function create({normalTable, reSpinTable}) {
    const create = addPackage(app, 'main');
    const scene = create('MainScene');

    const slot = SlotMachine({
        view: scene,
        table: normalTable,
    });

    Background(
        select('background'),
    );

    const effects =
        scene.children
            .filter(({name}) => name && name.includes('effect'))
            .sort((a, b) => id(a) - id(b));

    BigWin(
        select('bigWin'),
    );

    logic({
        reelTables: {normalTable, reSpinTable},
        slot,
        effects,
    });

    window.play = play;

    return scene;

    function play() {
        const key = process.env.KEY;
        const bet = 1;

        app.service.sendOneRound({key, bet})
            .then((result) => app.emit('GameResult', result));
    }

    function select(name) {
        return scene.getChildByName(name);
    }
}

function id({name}) {
    return Number(name.split('@')[1]);
}
