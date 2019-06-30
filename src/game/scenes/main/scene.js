import {addPackage} from 'pixi_fairygui';
import {SlotMachine} from './components/slot';

import anime from 'animejs';
import {wait, floor, abs} from '../../../general';

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

    async function play(icon) {
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

        const tarSymbol =
            targets.symbols
                .reduce((a, b) =>
                    a.displayPos < b.displayPos ? a : b);

        let tarPos = abs(tarSymbol.displayPos);

        if (icon !== 8) {
            tarSymbol.icon = icon;
        } else {
            tarPos += 1;
        }

        anime.remove(targets);
        anime
            .timeline({targets})
            .add({
                targets,
                pos: floor(targets.pos) + tarPos,
                easing: 'easeOutBack',
                duration: 750,
            });
    }
}
