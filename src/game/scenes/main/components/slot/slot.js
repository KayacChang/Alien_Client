import {isReel, isSymbol} from './util';

import {divide} from '../../../../../general';

import {stopPerSymbol} from '../../data';

export function SlotMachine(view) {
    const reels =
        view.children
            .filter(isReel)
            .map(Reel);

    return {
        get reels() {
            return reels;
        },
    };
}

function Symbol(view) {
    const stepSize =
        divide(view.height, stopPerSymbol);

    return {
        get stepSize() {
            return stepSize;
        },

        get y() {
            return view.y;
        },
        set y(newY) {
            view.y = newY;
        },
    };
}

function Reel(view) {
    const symbols =
        view.children
            .filter(isSymbol)
            .map(Symbol);

    let pos = 0;
    let vPos = 0;

    const it = {
        get symbols() {
            return symbols;
        },

        get vPos() {
            return vPos;
        },

        get pos() {
            return pos;
        },
        set pos(newPos) {
            vPos = newPos - pos;
            pos = newPos;
            update(it);
        },
    };

    return it;
}

function update(reel) {
    reel.symbols
        .forEach((symbol) => {
            symbol.y += symbol.stepSize * reel.vPos;
        });
}

