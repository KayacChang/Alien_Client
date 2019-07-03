import {addPackage} from 'pixi_fairygui';
import {SlotMachine} from './components/slot';

import anime from 'animejs';
import {wait} from '../../../general';

import {extras} from 'pixi.js';

const {BitmapText} = extras;

export function create({normalTable}) {
    const create = addPackage(app, 'main');
    const scene = create('MainScene');

    const slot = SlotMachine({
        view: scene,
        tables: normalTable,
    });

    const scores =
        scene.children
            .filter(({name}) => name.includes('pos'))
            .map(({x, y}) => {
                const score =
                    new BitmapText('$1,234,567,890', {font: '22px Score'});

                score.position.set(x, y);

                return score;
            });

    scene.addChild(...scores);

    window.slot = slot;
    window.play = play;

    return scene;

    async function play(icons) {
        for (const reel of slot.reels) {
            anime
                .timeline({
                    targets: reel,
                    easing: 'easeOutQuad',
                })
                .add({
                    pos: '-=' + 0.25,
                    duration: 500,
                })
                .add({
                    pos: '+=' + 100,
                    duration: 10000,
                });

            await wait(250);
        }

        await wait(3000);

        const tasks = [];
        for (const reel of slot.reels) {
            const index =
                slot.reels.indexOf(reel);

            anime.remove(reel);

            const displaySymbol =
                reel.symbols
                    .reduce((a, b) => a.displayPos < b.displayPos ? a : b);

            const task =
                anime({
                    targets: reel,
                    pos: '+=' + (2 - displaySymbol.displayPos),
                    easing: 'easeOutBack',
                    duration: 750,

                    begin() {
                        displaySymbol.icon = icons[index];
                    },
                })
                    .finished;

            tasks.push(task);

            await wait(250);
        }

        await Promise.all(tasks);
        slot.reels.forEach((reel) => reel.pos = 0);
    }
}
