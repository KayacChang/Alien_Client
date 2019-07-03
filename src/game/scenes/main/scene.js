import {addPackage} from 'pixi_fairygui';
import {SlotMachine} from './components/slot';

import {extras} from 'pixi.js';

const {BitmapText} = extras;

import {spin} from './logic';

import {symbolConfig} from './data';

export function create({normalTable}) {
    const create = addPackage(app, 'main');
    const scene = create('MainScene');

    const slot = SlotMachine({
        view: scene,
        tables: normalTable,
    });

    const scores =
        scene.children
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

    scene.addChild(...scores);

    const effects =
        scene.children
            .filter(({name}) => name && name.includes('effect'))
            .sort((a, b) => id(a) - id(b));

    window.slot = slot;
    window.play = play;

    return scene;

    async function play(icons) {
        await spin(slot.reels, icons);

        result(icons);
    }

    function result(icons) {
        icons.forEach((icon, index) => {
            const {name} = symbolConfig.find(({id}) => id === icon);

            const tar = effects[index].getChildByName(name);

            tar.visible = true;
            tar.transition['anim'].restart();

            app.on('SpinStart', () => {
                tar.visible = false;
                tar.transition['anim'].pause();
            });
        });
    }
}

function id({name}) {
    return Number(name.split('@')[1]);
}
