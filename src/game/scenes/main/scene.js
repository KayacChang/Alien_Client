import {addPackage} from 'pixi_fairygui';

import {Background, BigWin, SlotMachine} from './components';

import {logic} from './logic';

export function create(reelTables) {
    const create = addPackage(app, 'main');
    const scene = create('MainScene');

    const slot = SlotMachine({
        view: scene,
        table: reelTables.normalTable,
    });

    const effects =
        scene.children
            .filter(({name}) => name && name.includes('effect'))
            .sort((a, b) => id(a) - id(b));

    init();

    return scene;

    function init() {
        Background(
            select('background'),
        );

        BigWin(
            select('bigWin'),
        );

        logic({
            reelTables, slot, effects,
        });
    }

    function select(name) {
        return scene.getChildByName(name);
    }
}

function id({name}) {
    return Number(name.split('@')[1]);
}
