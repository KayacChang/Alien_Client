import {isReel, isSymbol} from './util';

import {divide, nth, mod, round, floor} from '../../../../../general';

import {stopPerSymbol, symbolConfig} from '../../data';

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

function Texture(icon) {
    if (!Texture.config) {
        const {textures} = app.resource.get('symbols');

        Texture.config =
            symbolConfig
                .filter(({texture}) => texture)
                .map(({id, texture}) =>
                    ({id, texture: textures[texture]}));
    }

    return Texture.config
        .find(({id}) => id === icon)
        .texture;
}

function Symbol(view, index) {
    const stepSize =
        divide(view.height, stopPerSymbol);

    const initPos = index * stopPerSymbol;
    let displayPos = initPos;

    let idx = Number(view.name.split('@')[1]);
    let icon = idx;

    return {
        get name() {
            return view.name;
        },

        get height() {
            return view.height;
        },

        get stepSize() {
            return stepSize;
        },

        get initPos() {
            return initPos;
        },

        get displayPos() {
            return displayPos;
        },
        set displayPos(newPos) {
            displayPos = newPos;
        },

        get y() {
            return view.y;
        },
        set y(newY) {
            view.y = newY;
        },

        get idx() {
            return idx;
        },
        set idx(newIdx) {
            idx = newIdx;
        },

        get icon() {
            return icon;
        },
        set icon(id) {
            view.texture = Texture(id);
            icon = id;
        },
    };
}

function Reel({view, table}) {
    const symbols =
        view.children
            .filter(isSymbol)
            .sort((a, b) => a.y - b.y)
            .map(Symbol);

    const offsetY = symbols[0].y;

    let pos = 0;

    const initIdx =
        symbols
            .reduce((a, b) => a.idx > b.idx ? a : b)
            .idx;

    const displayLength =
        symbols.length * stopPerSymbol;

    symbols.forEach((symbol) => {
        symbol.icon = nth(symbol.idx, table);
    });

    const reel = {
        get name() {
            return view.name;
        },

        get symbols() {
            return symbols;
        },

        get displayLength() {
            return displayLength;
        },

        get offsetY() {
            return offsetY;
        },

        get initIdx() {
            return initIdx;
        },

        get table() {
            return table;
        },
        set table(newTable) {
            table = newTable;
        },

        get pos() {
            return pos;
        },
        set pos(newPos) {
            pos = mod(newPos, table.length);
            update(reel);
        },
    };

    return reel;
}

function update(reel) {
    reel.symbols
        .forEach((symbol) => {
            const pos =
                mod(reel.pos + symbol.initPos, reel.table.length);

            const displayPos =
                mod(pos, reel.displayLength);

            const swap =
                round(symbol.displayPos - displayPos) >= reel.displayLength;

            if (swap) {
                const id = divide(floor(reel.pos), 2) + reel.initIdx;

                symbol.icon = nth(id, reel.table);
            }

            symbol.displayPos = displayPos;

            symbol.y =
                reel.offsetY + (symbol.displayPos * symbol.stepSize);
        });
}
