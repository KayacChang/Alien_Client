import {Board} from './Board';
import {wait} from '../../../../general';

export function Background(view) {
    Board(
        select('board'),
    );

    const boardEffect = select('board@effect');

    const ShowBigWin = view.transition['ShowBigWin'];
    const HideBigWin = view.transition['HideBigWin'];
    const ShowJackPot = view.transition['ShowJackPot'];
    const HideJackPot = view.transition['HideJackPot'];

    const ShowAlien = view.transition['ShowAlien'];
    const HideAlien = view.transition['HideAlien'];

    init();

    return {
        showBigWin,
        hideBigWin,
        showJackPot,
        hideJackPot,

        showAlien,
        hideAlien,
    };

    function init() {
        ShowBigWin.pause();
        ShowJackPot.pause();
        ShowAlien.pause();
        HideAlien.pause();

        boardEffect.visible = false;

        app.once('Idle', () => requestAnimationFrame(onIdle));

        async function onIdle() {
            await showAlien();

            await wait(500);

            return hideAlien();
        }
    }

    function select(name) {
        return view.getChildByName(name);
    }

    function showBigWin() {
        boardEffect.visible = true;

        ShowBigWin.restart();
    }

    function hideBigWin() {
        HideBigWin.restart();

        HideBigWin.finished
            .then(() => boardEffect.visible = false);
    }

    function showJackPot() {
        boardEffect.visible = true;

        ShowJackPot.restart();
    }

    function hideJackPot() {
        HideJackPot.restart();

        HideJackPot.finished
            .then(() => boardEffect.visible = false);
    }

    function showAlien() {
        ShowAlien.restart();

        return ShowAlien.finished;
    }

    function hideAlien() {
        HideAlien.restart();

        return HideAlien.finished;
    }
}
