import {log, table} from '../../../../general';

import {spin} from './spin';
import {show} from './show';

export function logic({slot, effects, reelTables}) {
    app.on('GameResult', onGameResult);

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
            slot.table = reelTables.reSpinTable;

            for (const round of reSpinGame) {
                await display(round, [slot.reels[1]]);
            }
        }

        app.user.jackPot = jackPot;

        slot.table = reelTables.normalTable;

        log('Round Complete...');
        app.emit('Idle');
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

    async function display(result, reels = slot.reels) {
        table(result);

        result = process(result);

        const {hasLink, symbols, scores} = result;

        const displaySymbols = await spin(reels, symbols);

        if (hasLink) {
            displaySymbols
                .forEach((symbol) => symbol.visible = false);

            app.on('SpinStart', () => {
                displaySymbols
                    .forEach((symbol) => symbol.visible = true);
            });

            show(effects, symbols);

            return scores;
        }

        return 0;
    }

    async function test(symbols, reels = slot.reels) {
        const result = process({symbols});

        console.log(result);

        const displaySymbols = await spin(reels, result.symbols);

        displaySymbols
            .forEach((symbol) => symbol.visible = false);

        app.on('SpinStart', () => {
            displaySymbols
                .forEach((symbol) => symbol.visible = true);
        });

        show(effects, result.symbols);
    }
}
