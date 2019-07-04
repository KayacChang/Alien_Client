import anime from 'animejs';
import {wait} from '../../../../general';

export async function spin(reels, icons) {
    await start(reels);

    await wait(3000);

    await stop(reels, icons);
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
    const stops = [];

    const displaySymbols = [];

    for (const reel of reels) {
        const index = reels.indexOf(reel);

        anime.remove(reel);

        const displaySymbol =
            reel.symbols
                .reduce((a, b) => a.displayPos < b.displayPos ? a : b);

        displaySymbols.push(displaySymbol);

        displaySymbol.icon = icons[index];

        reel.pos -= displaySymbol.displayPos;

        // const diff =
        //     (reel.pos + 2 >= reel.table.length) ? 1 : 2;

        const stop =
            anime({
                targets: reel,
                pos: '+=' + 2,
                easing: 'easeOutBack',
                duration: 750,
            })
                .finished;

        stops.push(stop);

        await wait(250);
    }

    await Promise.all(stops);

    displaySymbols.forEach((symbol) => symbol.visible = false);

    app.on('SpinStart', () => {
        displaySymbols.forEach((symbol) => symbol.visible = true);
    });
}

