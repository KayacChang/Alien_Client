import {spin} from '../anim/spin';
import {show} from '../anim/show';

import {process} from './index';

export async function NormalGame({result, reels, effects, func}) {
    result.symbols = process(result.symbols);

    const {hasLink, symbols, scores} = result;

    await spin({reels, symbols, func});

    if (hasLink) await show(effects, result);

    return scores;
}


