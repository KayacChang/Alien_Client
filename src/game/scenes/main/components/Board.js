import {extras} from 'pixi.js';

const {BitmapText} = extras;

import {currencyFormat} from '../../../../general';

const style = {font: '30px Score'};

export function Board(view) {
    const table = OddsTable(app.user.payTable);

    console.log(table);

    const scores =
        view.children
            .filter(({name}) => name && name.includes('pos'))
            .map(({name, x, y}) => {
                console.log(name);

                const score =
                    new BitmapText('0', style);

                score.position.set(x, y);

                if (name.includes('jackpot')) {
                    JackPot(score);
                } else {
                    Normal(score, 0);
                }

                return score;
            });

    view.addChild(...scores);
}

function OddsTable(data) {
    return {
        '5x': data[0],
        '3x': data[1],
        '2x': data[2],
        'seven': data[3],
        '3bar': data[4],
        '2bar': data[5],
        '1bar': data[6],
        'any': data[7],
    };
}

function JackPot(view) {
}

function Normal(view, odds = 0) {
    view.scale.set(0.9, 0.8);

    view.text = currencyFormat(odds);
}
