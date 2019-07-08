import {extras} from 'pixi.js';

const {BitmapText} = extras;

import {currencyFormat} from '../../../../general';

const style = {font: '30px Score'};

export function Board(view) {
    const scores =
        view.children
            .filter(({name}) => name && name.includes('pos'))
            .map(({name, x, y}) => {
                const score =
                    new BitmapText('0', style);

                score.position.set(x, y);

                if (name.includes('jackpot')) {
                    score.name = name.split('_')[1];

                    JackPot(score);
                } else {
                    score.name = name.split('@')[1];

                    Normal(score);
                }

                return score;
            });

    view.addChild(...scores);

    return view;
}

function getOdds(name) {
    const {payTable} = app.user;

    return {
        '5x': payTable[0],
        '3x': payTable[1],
        '2x': payTable[2],
        'seven': payTable[3],
        '3bar': payTable[4],
        '2bar': payTable[5],
        '1bar': payTable[6],
        'any': payTable[7],
    }[name];
}

function JackPot(view) {
    update();

    app.on('UserBetChange', update);
    app.on('JackPotChange', update);

    return view;

    function update() {
        const {name} = view;

        const score =
            currentBet() * getOdds(name) + app.user.jackPot[name];

        view.text = currencyFormat(score);
    }
}

function Normal(view) {
    view.scale.set(0.9, 0.8);

    update();

    app.on('UserBetChange', update);

    return view;

    function update() {
        const {name} = view;

        const score =
            currentBet() * getOdds(name);

        view.text = currencyFormat(score);
    }
}

function currentBet() {
    const {bet, betOptions} = app.user;

    return betOptions[bet];
}
