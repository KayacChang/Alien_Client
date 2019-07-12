import {extras} from 'pixi.js';

const {BitmapText} = extras;

import {currencyFormat, wait} from '../../../../general';
import {currencyChange, fadeIn, fadeOut} from '../effect';
import anime from 'animejs';

const style = {font: '30px Score'};

export function Normal(view) {
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

                    PayLine(score);
                }

                return score;
            });

    view.addChild(...scores);

    view.show = show;
    view.hide = hide;

    return view;

    function show() {
        return fadeIn({targets: view}).finished;
    }

    function hide() {
        return fadeOut({targets: view}).finished;
    }
}

export function ReSpin(view) {
    const scores =
        view.children
            .filter(({name}) => name.includes('pos'))
            .map(({name, x, y}) => {
                const score =
                    new BitmapText('0', style);

                score.anchor.set(0.5, 1);
                score.position.set(x, y);

                score.name = name.split('_')[1];

                if (['2x', '3x'].includes(score.name)) {
                    score.scale.set(0.9, 0.8);
                }

                JackPot(score);

                return score;
            });

    const planets =
        view.children
            .filter(({name}) => name.includes('planet'));

    view.addChild(...scores);

    view.show = show;
    view.hide = hide;

    return view;

    async function show() {
        view.alpha = 1;

        planets.forEach((it) => it.alpha = 0);
        scores.forEach((it) => it.alpha = 0);

        const showAnim = view.transition['show'];

        showAnim.restart();

        await wait(1000);

        fadeIn({
            targets: scores,
            delay: anime.stagger(250),
        });

        return showAnim.finished;
    }

    function hide() {
        return fadeOut({targets: view}).finished;
    }
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
    const {name} = view;

    let score = getScore();

    view.text = currencyFormat(score);

    app.on('UserBetChange', update);
    app.on('JackPotChange', update);

    return view;

    function getScore() {
        return currentBet() * getOdds(name) + app.user.jackPot[name];
    }

    function update() {
        const newScore = getScore();

        currencyChange({
            range: [score, newScore],
            targets: view,
            duration: 500,
        });

        score = newScore;
    }
}

function PayLine(view) {
    const {name} = view;

    let score = getScore();

    view.text = currencyFormat(score);

    view.scale.set(0.9, 0.8);

    app.on('UserBetChange', update);

    return view;

    function getScore() {
        return currentBet() * getOdds(name);
    }

    function update() {
        const newScore = getScore();

        currencyChange({
            range: [score, newScore],
            targets: view,
            duration: 500,
        });

        score = newScore;
    }
}

function currentBet() {
    const {bet, betOptions} = app.user;

    return betOptions[bet];
}
