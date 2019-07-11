import {log, table, wait, randomInt} from '../../../../general';

import {spin} from './spin';
import {show} from './show';
import {shake} from '../effect';
import anime from 'animejs';

export function logic({slot, effects, reelTables, background}) {
    app.on('GameResult', onGameResult);

    const {
        greenAlien,
        redAlien,

        showAlien,
        hideAlien,

        showMagnet,
        hideMagnet,

        startAttraction,
        stopAttraction,
    } = background;

    window.test = test;

    async function onGameResult(result) {
        log('Result =============');
        table(result);

        const {
            normalGame,

            hasReSpin,
            reSpinGame,

            jackPot,
        } = result;

        const scores = await display(normalGame);

        if (scores > 0) {
            app.user.lastWin = normalGame.scores;
            app.user.cash += normalGame.scores;
        }

        if (hasReSpin) {
            // TODO: Show ReSpin Title

            await showAlien();
            await showMagnet();

            slot.table = reelTables.reSpinTable;

            for (const round of reSpinGame) {
                greenAlien.transition[randomInt(3)].restart();
                redAlien.transition[randomInt(3)].restart();

                startAttraction();

                app.once('SpinStopComplete', stopAttraction);

                const {hasLink} = round;

                const func = hasLink && reSpinStopAnimation();

                await display(
                    round,
                    [slot.reels[1]],
                    func,
                );
            }

            greenAlien.transition[1].restart();
            redAlien.transition[1].restart();
            await hideMagnet();

            hideAlien();
        }

        app.user.jackPot = jackPot;

        slot.table = reelTables.normalTable;

        log('Round Complete...');
        app.emit('Idle');
    }

    function reSpinStopAnimation() {
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
                    greenAlien.transition[3].restart();
                    redAlien.transition[3].restart();

                    startAttraction(24);

                    shake({
                        targets: reel.symbols,
                        duration: 2000,
                        amplitude: 12,
                    });
                },
            })
            .finished;
    }

    function process(result) {
        result.symbols =
            result.symbols
                .map((icon, index) => {
                    if (icon === 0 && index !== 1) return `${icon}${index}`;

                    return icon + '';
                });

        return result;
    }

    async function display(result, reels = slot.reels, func) {
        table(result);

        result = process(result);

        const {hasLink, symbols, scores} = result;

        await spin(reels, symbols, func);

        if (hasLink) {
            hideSymbols();

            show(effects, symbols);

            await wait(2000);

            return scores;
        }

        return 0;
    }

    function hideSymbols() {
        slot.reels.forEach((reel) =>
            reel.symbols.forEach((symbol) =>
                symbol.visible = false));
    }

    async function test(symbols, reels = slot.reels) {
        const result = process({symbols});

        const displaySymbols = await spin(reels, result.symbols);

        displaySymbols
            .forEach((symbol) => symbol.visible = false);

        app.once('SpinStart', () => {
            displaySymbols
                .forEach((symbol) => symbol.visible = true);
        });

        show(effects, result.symbols);

        log('Round Complete...');
        app.emit('Idle');
    }
}
