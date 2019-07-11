import {randomInt} from '../../../../general/algorithm';

export function shake({targets, duration, amplitude}) {
    if (!targets.length) targets = [targets];

    targets.forEach((target) => _shake(target));

    const begin = new Date();

    function _shake(target, pos) {
        const range = [-1 * amplitude, amplitude];

        const {x, y} = pos || target;
        setPos(
            x + randomInt(...range),
            y + randomInt(...range),
        );

        requestAnimationFrame(() =>
            check() ?
                _shake(target, {x, y}) :
                setPos(x, y),
        );

        function setPos(x, y) {
            target.x = x;
            target.y = y;
        }
    }

    function check() {
        const now = new Date();
        return (now - begin) < duration;
    }
}
