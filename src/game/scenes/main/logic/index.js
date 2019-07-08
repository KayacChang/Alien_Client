import {log, table} from '../../../../general';

import {spin} from './spin';
import {show} from './show';

export function logic({slot, effects, reelTables}) {
    app.on('GameResult', async (result) => {
        log('Result =============');
        table(result);

        const {
            normalGame,

            hasReSpin,
            reSpinGame,

            jackPot,
        } = result;

        await display(normalGame);

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
    });

    async function display(result, reels = slot.reels) {
        table(result);

        const {hasLink, symbols} = result;

        const displaySymbols = await spin(reels, symbols);

        if (hasLink) {
            displaySymbols
                .forEach((symbol) => symbol.visible = false);

            app.on('SpinStart', () => {
                displaySymbols
                    .forEach((symbol) => symbol.visible = true);
            });

            show(effects, symbols);
        }
    }
}
