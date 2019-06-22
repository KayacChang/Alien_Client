import {isReel, isSymbol} from './util';

// import {symbolConfig} from '../../data';

export function SlotMachine(view) {
    // const {getTexture} = TextureManager(symbolConfig);


    // const reels =
    view.children
        .filter(isReel)
        .map(Reel);

    function Symbol(view) {

    }

    function Reel(view) {
        const symbols = view.children
            .filter(isSymbol)
            .map(Symbol);

        return {
            get symbols() {
                return symbols;
            },
        };
    }
}

