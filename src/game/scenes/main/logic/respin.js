import {randomInt, wait} from '../../../../general';
import anime from 'animejs';
import {shake} from '../effect';
import {NormalGame} from './normal';

export async function ReSpinGame({results, reels, effects, background}) {
    const {
        greenAlien,
        redAlien,

        startAttraction,
        stopAttraction,
    } = background;

    await onReSpinStart(background);

    let total = 0;

    for (const result of results) {
        app.once('SpinStart', () => {
            greenAlien.happy();
            redAlien.happy();

            startAttraction();
        });

        app.once('ShowResult', () => {
            greenAlien.happy();
            redAlien.happy();
        });

        app.once('Attraction', () => {
            greenAlien.shy();
            redAlien.shy();

            startAttraction(24);

            shake({
                targets: reels.symbols,
                duration: 2000,
                amplitude: 12,
            });
        });

        app.once('SpinStopComplete', stopAttraction);

        total +=
            await NormalGame({
                result,
                reels,
                effects,
                func: reSpinStopAnimation(result),
            });
    }

    await onReSpinEnd(background, total);

    return total;
}

async function onReSpinStart(background) {
    const {
        boardEffect,
        reSpinBoard,

        greenAlien,
        redAlien,

        showAlien,
    } = background;

    await boardEffect.reSpin.show();
    await wait(1000);
    await boardEffect.reSpin.hide();

    await Promise.all([
        reSpinBoard.show(),
        showAlien(),
    ]);

    await Promise.all([
        greenAlien.showMagnet(),
        redAlien.showMagnet(),
    ]);
}

async function onReSpinEnd(background, total) {
    const {
        normalBoard,
        reSpinBoard,

        greenAlien,
        redAlien,

        hideAlien,
    } = background;

    const func = (total > 0) ? 'happy' : 'sad';

    greenAlien[func]();
    redAlien[func]();

    await Promise.all([
        greenAlien.hideMagnet(),
        redAlien.hideMagnet(),
    ]);

    await Promise.all([
        hideAlien(),
        reSpinBoard.hide(),
    ]);

    return normalBoard.show();
}

function reSpinStopAnimation({hasLink}) {
    const number = randomInt(100);

    const flag = hasLink ? 35 : 20;

    if (number >= flag) return;

    const sign = randomInt(1);
    const firstPos = sign ? 1 : 3;
    const lastPos = sign ? '+=' : '-=';

    return (reel) => anime
        .timeline({targets: reel})
        .add({
            pos: '+=' + firstPos,
            easing: 'easeOutBack',
            duration: 750,

            begin() {
                app.emit('ReelStop', reel);
            },
        })
        .add({
            pos: lastPos + 1,
            easing: 'easeInOutElastic(3, .5)',
            duration: 2000,
            delay: 750,

            begin() {
                app.emit('Attraction', reel);
            },
        })
        .finished;
}
