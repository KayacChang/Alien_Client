import {addPackage} from 'pixi_fairygui';
import {SlotMachine} from './components/slot';

import anime from 'animejs';
import {wait, floor} from '../../../general';

export function create({normalTable}) {
    const create = addPackage(app, 'main');
    const scene = create('MainScene');

    const slot = SlotMachine({
        view: scene,
        tables: normalTable,
    });

    window.slot = slot;
    window.play = play;

    return scene;

    async function play(icon = 0) {
        const targets = slot.reels[0];
        anime
            .timeline({targets})
            .add({
                pos: '-=' + 0.25,
                duration: 750,
                easing: 'easeOutBack',
            })
            .add({
                pos: '+=' + 120.25,
                duration: 10000,
                easing: 'easeOutQuad',
            });

        await wait(3000);

        targets.symbols
            .find(({displayPos}) => displayPos < -2)
            .icon = icon;

        anime.remove(targets);
        anime
            .timeline({targets})
            .add({
                targets,
                pos: floor(targets.pos) + 3,
                easing: 'easeOutBack',
                duration: 750,
            });
    }
}
