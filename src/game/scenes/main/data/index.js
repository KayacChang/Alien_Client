import {sprites} from './sprites';
import {symbols, symbolConfig} from './symbols';

import NUMBER_URL from '../assets/fonts/number.xml';
import '../assets/fonts/number.png';


export function reserve() {
    return [
        ...(sprites),
        ...(symbols),

        {name: 'Score', url: NUMBER_URL},
    ];
}


const stopPerSymbol = 2;

export {
    stopPerSymbol,

    symbolConfig,
};

