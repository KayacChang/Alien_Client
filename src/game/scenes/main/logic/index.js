import {log, table, divide} from '../../../../general';

import {NormalGame} from './normal';
import {ReSpinGame} from './respin';
import {fadeIn, fadeOut} from '../effect';

export function logic({slot, effects, background}) {
    app.on('GameResult', onGameResult);

    async function onGameResult(result) {
        log('Result =============');
        table(result);

        const {
            normalGame,

            hasReSpin,
            reSpinGame,

            jackPot,
        } = result;

        const scores =
            await NormalGame({
                result: normalGame,
                reels: slot.reels,
                effects,
            });

        await clearAccount({scores, background});

        if (hasReSpin) {
            const scores =
                await ReSpinGame({
                    results: reSpinGame,
                    reels: slot.reels[1],
                    effects,
                    background,
                });

            await clearAccount({scores, background});
        }

        app.user.jackPot = jackPot;

        log('Round Complete...');
        app.emit('Idle');
    }
}

async function clearAccount({scores, background}) {
    const {bigwin} = background;

    if (divide(scores, app.user.currentBet) > 10) {
        const {alpha} = app.control.main;

        fadeOut({targets: app.control.main});

        await bigwin.play(scores);

        fadeIn({targets: app.control, alpha});
    }

    app.user.cash += scores;
}

