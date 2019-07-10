import {Board} from './Board';

export function Background(view) {
    Board(
        select('board'),
    );

    const boardEffect = select('board@effect');

    const ShowBigWin = view.transition['ShowBigWin'];
    const HideBigWin = view.transition['HideBigWin'];
    const ShowJackPot = view.transition['ShowJackPot'];
    const HideJackPot = view.transition['HideJackPot'];

    init();

    return {
        showBigWin,
        hideBigWin,
        showJackPot,
        hideJackPot,
    };

    function init() {
        ShowBigWin.pause();
        ShowJackPot.pause();

        boardEffect.visible = false;
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
}
