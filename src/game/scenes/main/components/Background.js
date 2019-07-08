import {Board} from './Board';

export function Background(view) {
    const board = Board(
        select('board'),
    );

    const boardEffect = select('board@effect');

    const ShowBigWin = view.transition['ShowBigWin'];
    const HideBigWin = view.transition['HideBigWin'];

    init();

    return {
        showBigWin,
        hideBigWin,
    };

    function init() {
        ShowBigWin.pause();
        HideBigWin.pause();

        boardEffect.visible = false;

        board.alpha = 1;
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
}
