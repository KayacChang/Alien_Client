import {Normal, ReSpin} from './Board';
import {nextFrame, wait} from '../../../../general';
import {Alien} from './Alien';
import {shake} from '../effect';
import {BigWin} from './BigWin';

export function Background(view) {
    const normalBoard =
        Normal(select('board@normal'));

    const reSpinBoard =
        ReSpin(select('board@respin'));

    const boardEffect = BoardEffect();

    const bigwin =
        BigWin(select('bigWin'));

    const jackpot =
        BigWin(select('jackpot'));

    const [greenAlien, redAlien] =
        ['green', 'red']
            .map((name) => Alien(select(`alien@${name}`)));

    const electron = view.getChildByName('effect@electron');

    let shaking = false;
    let charging = false;

    return init();

    function init() {
        boardEffect.visible = false;

        app.once('Idle', () => nextFrame().then(onIdle));

        return {
            bigwin,
            jackpot,

            boardEffect,

            normalBoard,
            reSpinBoard,

            greenAlien,
            redAlien,

            showAlien,
            hideAlien,

            startAttraction,
            stopAttraction,
        };

        async function onIdle() {
            await showAlien();

            await wait(500);

            normalBoard.show();

            await hideAlien();
        }
    }

    function BoardEffect() {
        const background = select('board@effect');

        return {
            bigWin: TextEffect('BigWin'),
            jackPot: TextEffect('JackPot'),
            reSpin: TextEffect('ReSpin'),

            get visible() {
                return background.visible;
            },
            set visible(flag) {
                background.visible = flag;
            },
        };
    }

    function TextEffect(name) {
        const Show = view.transition['Show' + name];
        const Hide = view.transition['Hide' + name];

        Show.pause();
        Hide.pause();

        return {show, hide};

        async function show() {
            if (normalBoard.alpha !== 0) await normalBoard.hide();

            boardEffect.visible = false;

            Show.restart();

            return Show.finished;
        }

        async function hide() {
            Hide.restart();

            await Hide.finished;

            boardEffect.visible = false;
        }
    }

    function showAlien() {
        const ShowAlien = view.transition['ShowAlien'];

        ShowAlien.restart();

        return ShowAlien.finished;
    }

    function hideAlien() {
        const HideAlien = view.transition['HideAlien'];

        HideAlien.restart();

        return HideAlien.finished;
    }

    function startAttraction(amplitude = 3) {
        if (shaking || charging) stopAttraction();

        startShaking(amplitude);
        startCharging(amplitude);
    }

    function stopAttraction() {
        shaking = false;
        charging = false;
        electron.visible = false;
    }

    async function startShaking(amplitude = 3) {
        shaking = true;

        const targets = [greenAlien, redAlien];

        while (shaking) await shake({targets, amplitude});
    }

    async function startCharging(amplitude = 3) {
        electron.visible = true;
        charging = true;

        while (charging) await shake({targets: electron, amplitude});
    }

    function select(name) {
        return view.getChildByName(name);
    }
}
