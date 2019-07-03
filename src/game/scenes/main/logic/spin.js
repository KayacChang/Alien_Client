import anime from 'animejs';
import {wait} from '../../../../general';

export async function spin(reels, icons) {
    await start(reels);

    await wait(3000);

    const stopped = await stop(reels, icons);

    await Promise.all(stopped);
}

async function start(reels) {
    app.emit('SpinStart');

    for (const reel of reels) {
        anime
            .timeline({
                targets: reel,
                easing: 'easeOutQuad',
            })
            .add({
                pos: '-=' + 0.25,
                duration: 500,
            })
            .add({
                pos: '+=' + 100,
                duration: 10000,
            });

        await wait(250);
    }
}

async function stop(reels, icons) {
    const tasks = [];
    for (const reel of reels) {
        const index = reels.indexOf(reel);

        anime.remove(reel);

        const displaySymbol =
            reel.symbols
                .reduce((a, b) => a.displayPos < b.displayPos ? a : b);

        const task =
            anime({
                targets: reel,
                pos: '+=' + (2 - displaySymbol.displayPos),
                easing: 'easeOutBack',
                duration: 750,

                begin() {
                    displaySymbol.icon = icons[index];
                },

                complete() {
                    displaySymbol.visible = false;

                    app.on('SpinStart', () => displaySymbol.visible = true);
                },
            })
                .finished;

        tasks.push(task);

        await wait(250);
    }

    return tasks;
}

