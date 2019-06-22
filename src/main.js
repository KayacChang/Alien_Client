import 'core-js/stable';
import 'regenerator-runtime/runtime';
import {log, select} from './general';

import {App} from './system/application';

async function main() {
    //  Init App
    try {
        global.app = App();

        app.on('loading', ({progress}, {name}) => {
            log(`Progress: ${progress} %`);
            log(`Resource: ${name}`);
        });

        //  Import Main Scene
        const [MainScene] =
            await Promise.all([
                import('./game/scenes/main'),
            ]);

        await app.resource.load(MainScene);

        const scene = MainScene.create();

        app.stage.addChildAt(scene, 0);

        const comp = select('#app');
        const svg = select('#preload');
        svg.remove();
        comp.prepend(app.view);

        app.resize();

        app.emit('Idle');
    } catch (error) {
        console.error(error);

        // const msg = {title: error.message};

        // app.alert.error(msg);
    }
}

main();
