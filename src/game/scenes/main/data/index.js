import {sprites} from './sprites';
import {symbols, symbolConfig} from './symbols';

import SCORE_URL from '../assets/fonts/score.xml';
import '../assets/fonts/score.png';

import BIGWIN_URL from '../assets/fonts/bigwin.xml';
import '../assets/fonts/bigwin.png';


export function reserve() {
    return [
        ...(sprites),
        ...(symbols),

        {name: 'Score', url: SCORE_URL},
        {name: 'BigWin', url: BIGWIN_URL},
    ];
}


const stopPerSymbol = 2;

export {
    stopPerSymbol,

    symbolConfig,
};

