import {addPackage} from 'pixi_fairygui';

import {Background, SlotMachine, Waters} from './components';

import {logic} from './logic';
import {twink} from './effect';

export function create({normalTable}) {
    const create = addPackage(app, 'main');
    const scene = create('MainScene');

    return init();

    function init() {
        const slot = SlotMachine({
            view: scene,
            table: normalTable,
        });

        const effects =
            scene.children
                .filter(({name}) => name && name.includes('effect'))
                .sort((a, b) => id(a) - id(b));

        const background = Background(
            select('background'),
        );

        window.background = background;

        const lights =
            scene.children
                .filter(({name}) => name && name.includes('light'))
                .sort((a, b) => id(a) - id(b))
                .map(Light);

        app.on('MaybeBonus', onMaybeBonus);

        Waters(scene);

        logic({
            slot,
            effects,
            background,
        });

        return scene;

        function onMaybeBonus(reel) {
            const current = reel.index;
            const next = current + 1;

            lights[current].off();

            if (next < lights.length) lights[next].show();
        }
    }

    function select(name) {
        return scene.getChildByName(name);
    }
}

function id({name}) {
    return Number(name.split('@')[1]);
}

function Light(view) {
    let twinkling = false;

    return {show, off};

    async function show() {
        twinkling = true;
        while (twinkling) await twink({targets: view, interval: 500});
    }

    function off() {
        twinkling = false;
    }
}
