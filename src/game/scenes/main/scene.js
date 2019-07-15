import {addPackage} from 'pixi_fairygui';

import {Background, Light, SlotMachine, Waters} from './components';

import {logic} from './logic';
import {fadeIn, fadeOut} from './effect';

import {extras} from 'pixi.js';

const {BitmapText} = extras;

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

        app.on('RespinStart', () => {
            const targets = select('shadow@respin');

            fadeIn({targets, alpha: 0.7});

            app.once('Idle', () => fadeOut({targets}));
        });

        app.on('ShowResult', async ({scores}) => {
            const targets = select('shadow@normal');

            await fadeIn({targets, alpha: 0.7}).finished;

            const style = {font: '30px Score'};
            const score = new BitmapText(`${scores}`, style);

            score.anchor.set(.5);

            const pos = select('pos@score');
            score.position.set(pos.x, pos.y);

            const timer =
                setInterval(() =>
                    score.visible = !score.visible, 1000);

            scene.addChildAt(score, scene.getChildIndex(pos));

            app.once('SpinStart', async () => {
                await fadeOut({targets}).finished;
                clearInterval(timer);
                scene.removeChild(score);
            });
        });

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

        app.on('ReelStop', () => {
            app.sound.play('Reel_Stop_1');
            app.sound.play('Reel_Stop_2');
        });

        app.on('ShowResult', ({symbols}) => {
            const includeJackpot =
                ['1', '2', '3'].includes(symbols[1]);

            const firstReelWild =
                symbols[0] === '00';
            const thirdReelWild =
                symbols[2] === '02';

            const sound =
                (includeJackpot) ? 'Jackpot_Connect' :
                    (firstReelWild || thirdReelWild) ? 'Wild_Connect' :
                        'Normal_Connect';
            app.sound.play(sound);
        });

        app.alert.request({title: translate(`common:message.audio`)})
            .then(({value}) => {
                app.sound.mute(!value);

                app.sound.play('Normal_BGM');
            });

        return scene;

        function onMaybeBonus(reel) {
            const current = reel.index;
            const next = current + 1;

            lights[current].off();

            if (next < lights.length) {
                app.sound.play('Maybe_Bonus');
                lights[next].show();
            }
        }
    }

    function select(name) {
        return scene.getChildByName(name);
    }
}

function id({name}) {
    return Number(name.split('@')[1]);
}
