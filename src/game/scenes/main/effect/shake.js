import {randomInt, nextFrame} from '../../../../general';

const {assign} = Object;

export function shake({targets, duration = 0, amplitude = 0}) {
    if (!targets.length) targets = [targets];

    const range = [-1 * amplitude, amplitude];

    const begin = new Date();

    const tasks = targets.map((target) => call(target));

    return Promise.all(tasks);

    async function call(target, pos) {
        const {x, y} = pos || target;

        assign(target, {
            x: x + randomInt(...range),
            y: y + randomInt(...range),
        });

        await nextFrame();

        return isTimeout() ?
            assign(target, {x, y}) : call(target, {x, y});
    }

    function isTimeout() {
        const now = new Date();
        return (now - begin) > duration;
    }
}
