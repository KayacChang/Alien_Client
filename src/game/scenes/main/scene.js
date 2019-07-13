import {addPackage} from 'pixi_fairygui';

import {Background, BigWin, SlotMachine, Waters} from './components';

import {logic} from './logic';

export function create({normalTable}) {
    const create = addPackage(app, 'main');
    const scene = create('MainScene');

    const slot = SlotMachine({
        view: scene,
        table: normalTable,
    });

    const effects =
        scene.children
            .filter(({name}) => name && name.includes('effect'))
            .sort((a, b) => id(a) - id(b));

    init();

    return scene;

    function init() {
        const background = Background(
            select('background'),
        );

        Waters(scene);

        logic({
            slot,
            effects,
            background,
        });
    }

    function select(name) {
        return scene.getChildByName(name);
    }
}

function id({name}) {
    return Number(name.split('@')[1]);
}
