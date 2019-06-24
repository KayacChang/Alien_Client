import {sprites} from './sprites';
import {symbols, symbolConfig} from './symbols';


export function reserve() {
    return [
        ...(sprites),
        ...(symbols),
    ];
}


const stopPerSymbol = 2;

export {
    stopPerSymbol,

    symbolConfig,
};

