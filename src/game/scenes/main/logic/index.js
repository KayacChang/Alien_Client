import {log, table, divide} from '../../../../general';

import {NormalGame, ReSpinGame} from './flow';

const BET_TO_BIGWIN = 10;

export function logic({slot, effects, background}) {
    app.on('GameResult', onGameResult);

    async function onGameResult(result) {
        log('onGameResult =============');
        table(result);

        const {
            normalGame,

            hasReSpin,
            reSpinGame,

            jackPot,
        } = result;

        log('onNormalGame =============');
        table(normalGame);

        const scores =
            await NormalGame({
                result: normalGame,
                reels: slot.reels,
                effects,
            });

        app.user.lastWin = scores;

        await clearAccount({scores, background});

        if (hasReSpin) {
            log('onReSpinGame =============');
            table({
                round: reSpinGame.length,
                totalScores:
                    reSpinGame.reduce((sum, {scores}) => sum + scores, 0),
            });
            reSpinGame.forEach(table);

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

    if (divide(scores, app.user.currentBet) > BET_TO_BIGWIN) {
        await bigwin.play(scores);
    }

    app.user.cash += scores;
}

