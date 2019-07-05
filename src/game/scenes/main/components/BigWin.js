import {wait} from '../../../../general';
import {currencyChange, fadeIn, fadeOut, popIn} from '../effect';

import {extras} from 'pixi.js';

const {BitmapText} = extras;

const style = {font: '36px BigWin'};

function ScoreField() {
    return new BitmapText('0', style);
}

export function BigWin(view) {
    const field = ScoreField();

    field.anchor.set(.5);

    const {x, y} = view.getChildByName('pos@score');
    field.position.set(x, y);

    return {play};

    async function play(score) {
        reset();

        view.transition['anim'].restart();
        await wait(1750);

        mount();

        await show(score);

        await clear();
    }

    function reset() {
        view.visible = true;
        view.removeChild(field);
    }

    function mount() {
        view.addChild(field);
        fadeIn({targets: field, duration: 800});
        popIn({targets: field, duration: 800});
    }

    async function show(score) {
        await currencyChange({targets: field, range: score})
            .finished;

        await wait(500);
    }

    async function clear() {
        await fadeOut({targets: view, easing: 'easeInQuart'})
            .finished;

        view.visible = false;
        view.alpha = 1;
    }
}
