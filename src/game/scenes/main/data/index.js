import MAIN_URL from '../assets/sprite_sheets/main.fui';
import MAIN_ATLAS0_URL from '../assets/sprite_sheets/main@atlas0.png';

import SYMBOLS from '../assets/symbols/symbols.json';
import '../assets/symbols/symbols.png';

export const symbolConfig = [
    {id: 0, name: 'alien', texture: 'Aliens.png'},
    {id: 1, name: 'bar@1', texture: 'Bar1.png'},
    {id: 2, name: 'bar@2', texture: 'Bar2.png'},
    {id: 3, name: 'bar@3', texture: 'Bar3.png'},
    {id: 4, name: 'seven', texture: 'Seven.png'},
    {id: 5, name: 'wild@5x', texture: 'Wildx5.png'},
    {id: 6, name: 'wild@3x', texture: 'Wildx3.png'},
    {id: 7, name: 'wild@2x', texture: 'Wildx2.png'},
];

export function reserve() {
    return [
        {name: 'main.fui', url: MAIN_URL, xhrType: 'arraybuffer'},
        {name: 'main@atlas0.png', url: MAIN_ATLAS0_URL},
        {name: 'symbols', url: SYMBOLS},
    ];
}

