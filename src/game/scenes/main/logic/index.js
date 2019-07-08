import {log, table} from '../../../../general';

import {spin} from './spin';
import {show} from './show';

export function logic({reels, effects}) {
    app.on('GameResult', async (result) => {
        log('Result =============');
        table(result);

        const {normalGame} = result;

        await display(normalGame);

        log('Round Complete...');
        app.emit('Idle');
    });

    async function display(result) {
        log('Normal Game =============');
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
