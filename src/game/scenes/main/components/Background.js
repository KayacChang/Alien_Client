import {Board} from './Board';
import {wait} from '../../../../general';
import {randomInt} from '../../../../general';

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

    const greenAlien = view.getChildByName('alien@green');
    const redAlien = view.getChildByName('alien@red');

    const electron = view.getChildByName('effect@electron');

    greenAlien.magnet = greenAlien.getChildByName('magnet');
    redAlien.magnet = redAlien.getChildByName('magnet');

    let shaking = false;
    let charging = false;

    init();

    return {
        showBigWin,
        hideBigWin,
        showJackPot,
        hideJackPot,

        greenAlien,
        redAlien,

        showAlien,
        hideAlien,

        showMagnet,
        hideMagnet,

        startAttraction,
        stopAttraction,

        startShaking,
        stopShaking,

        startCharging,
        stopCharging,
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


