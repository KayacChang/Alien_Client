import {table} from '../../../../general';
import {spin} from './spin';
import {show} from './show';

export async function NormalGame({result, reels, effects, func}) {
    table(result);

    result.symbols = process(result.symbols);

    const {hasLink, symbols, scores} = result;

    await spin({reels, symbols, func});

    if (hasLink) {
        await show(effects, result);

        app.user.lastWin = scores;
    }

    return scores;
}

function process(symbols) {
    return symbols.map(
        (icon, index) =>
            (icon === 0 && index !== 1) ?
                `${icon}${index}` : `${icon}`);
}
