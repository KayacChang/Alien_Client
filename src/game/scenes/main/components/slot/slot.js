import {isReel, isSymbol} from './util';

import {divide, nth, sign, abs} from '../../../../../general';

import {stopPerSymbol, symbolConfig} from '../../data';

function getTexture(icon) {
    const {textures} = app.resource.get('symbols');

    const config =
        symbolConfig.map(({id, texture}) =>
            ({id, texture: textures[texture]}));

    return config
        .find(({id}) => id === icon)
        .texture;
}

export function SlotMachine({view, tables}) {
    const reels =
        view.children
            .filter(isReel)
            .map((view, index) => Reel({
                view,
                table: tables[index],
            }));

    return {
        get reels() {
            return reels;
        },
    };
}

function Symbol(view, pos) {
    const stepSize =
        divide(view.height, stopPerSymbol);

    pos = Number(view.name.split('@')[1]);

    let icon = pos;

    return {
        get pos() {
            return pos;
        },
        set pos(newPos) {
            pos = newPos;
        },
        get stepSize() {
            return stepSize;
        },

        get y() {
            return view.y;
        },
        set y(newY) {
            view.y = newY;
        },

        get height() {
            return view.height;
        },

        get icon() {
            return icon;
        },
        set icon(id) {
            view.texture = getTexture(id);
            icon = id;
        },
    };
}

function Reel({view, table}) {
    const symbols =
        view.children
            .filter(isSymbol)
            .map(Symbol)
            .sort((a, b) => a.index - b.index);

    let pos = 0;
    let vPos = 0;

    const height = view.height;
    const criticalValue = divide(view.height, 2);

    symbols.forEach((symbol) => {
        symbol.icon = nth(symbol.pos, table);
    });

    const it = {
        get symbols() {
            return symbols;
        },

        get height() {
            return height;
        },

        get criticalValue() {
            return criticalValue;
        },

        get table() {
            return table;
        },
        set table(newTable) {
            table = newTable;
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

            if (detectBound(reel, symbol)) {
                const signVal = sign(reel.vPos);
                swapSymbol(reel, symbol, signVal);
                updateSymbolPos(reel, symbol, signVal);
                updateSymbolIcon(reel, symbol);
                //
            }
        });
}

function swapSymbol(reel, symbol, sign) {
    symbol.y -= (sign) * reel.height;
}

function updateSymbolPos(reel, symbol, sign) {
    const diff = sign * reel.symbols.length;
    symbol.pos = (symbol.pos + diff) % reel.table.length;
}

function updateSymbolIcon(reel, symbol) {
    symbol.icon = nth(symbol.pos, reel.table);
}

function detectBound(reel, symbol) {
    return abs(symbol.y) >= reel.criticalValue;
}

