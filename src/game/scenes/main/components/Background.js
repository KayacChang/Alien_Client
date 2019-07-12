import {Normal, ReSpin} from './Board';
import {wait} from '../../../../general';
import {randomInt} from '../../../../general';

export function Background(view) {
    const normalBoard =
        Normal(
            select('board@normal'),
        );

    const reSpinBoard =
        ReSpin(
            select('board@respin'),
        );

    const boardEffect = select('board@effect');

    const [bigWin, jackPot, reSpin] =
        ['BigWin', 'JackPot', 'ReSpin'].map(TextEffect);

    const ShowAlien = view.transition['ShowAlien'];
    const HideAlien = view.transition['HideAlien'];

    const greenAlien = view.getChildByName('alien@green');
    const redAlien = view.getChildByName('alien@red');

    const electron = view.getChildByName('effect@electron');

    greenAlien.magnet = greenAlien.getChildByName('magnet');
    redAlien.magnet = redAlien.getChildByName('magnet');

    let shaking = false;
    let charging = false;

    init();

    return {
        bigWin,
        jackPot,
        reSpin,

        normalBoard,
        reSpinBoard,

        greenAlien,
        redAlien,

        showAlien,
        hideAlien,

        showMagnet,
        hideMagnet,

        startAttraction,
        stopAttraction,
    };

    function init() {
        boardEffect.visible = false;
        normalBoard.alpha = 0;
        reSpinBoard.alpha = 0;

        app.once('Idle', () => requestAnimationFrame(onIdle));

        async function onIdle() {
            await showAlien();

            await wait(500);

            normalBoard.show();

            await hideAlien();
        }
    }

    function TextEffect(name) {
        const Show = view.transition['Show' + name];
        const Hide = view.transition['Hide' + name];

        Show.pause();
        Hide.pause();

        return {show, hide};

        async function show() {
            if (normalBoard.alpha !== 0) await normalBoard.hide();

            Show.restart();

            boardEffect.visible = true;

            return Show.finished;
        }

        function hide() {
            Hide.restart();

            return Hide
                .finished
                .then(() => boardEffect.visible = false);
        }
    }

    function select(name) {
        return view.getChildByName(name);
    }

    function showAlien() {
        ShowAlien.restart();

        return ShowAlien.finished;
    }

    function hideAlien() {
        HideAlien.restart();

        return HideAlien.finished;
    }

    function showMagnet() {
        const showGreenMagnet = greenAlien.transition['ShowMagnet'];
        const showRedMagnet = redAlien.transition['ShowMagnet'];

        showGreenMagnet.restart();
        showRedMagnet.restart();

        return Promise.all([
            showGreenMagnet.finished,
            showRedMagnet.finished,
        ]);
    }

    function hideMagnet() {
        const hideGreenMagnet = greenAlien.transition['HideMagnet'];
        const hideRedMagnet = redAlien.transition['HideMagnet'];

        hideGreenMagnet.restart();
        hideRedMagnet.restart();

        return Promise.all([
            hideGreenMagnet.finished,
            hideRedMagnet.finished,
        ]);
    }

    function startAttraction(amplitude = 3) {
        if (shaking || charging) stopAttraction();

        startShaking(amplitude);
        startCharging(amplitude);
    }

    function stopAttraction() {
        stopShaking();
        stopCharging();
    }

    function startShaking(amplitude = 3) {
        shaking = true;

        shake(greenAlien);
        shake(redAlien);

        function shake(target, pos) {
            const range = [-1 * amplitude, amplitude];

            const {x, y} = pos || target.position;
            target.position.x = x + randomInt(...range);
            target.position.y = y + randomInt(...range);

            requestAnimationFrame(() =>
                (shaking) ?
                    shake(target, {x, y}) :
                    target.position.set(x, y),
            );
        }
    }

    function stopShaking() {
        shaking = false;
    }

    function startCharging(amplitude = 3) {
        electron.visible = true;

        charging = true;

        shake(electron);

        function shake(target, pos) {
            const range = [-1 * amplitude, amplitude];

            const {x, y} = pos || target.position;
            target.position.x = x + randomInt(...range);
            target.position.y = y + randomInt(...range);

            requestAnimationFrame(() =>
                (charging) ?
                    shake(target, {x, y}) :
                    target.position.set(x, y),
            );
        }
    }

    function stopCharging() {
        charging = false;
        electron.visible = false;
    }
}


