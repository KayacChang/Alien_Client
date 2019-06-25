import 'core-js/stable';
import 'regenerator-runtime/runtime';
import {log, select} from './general';

import {App} from './system/application';
import {Service} from './service/00';

async function main() {
    //  Init App
    try {
        document.title = 'For Every Gamer | 61 Studio';

        global.app = App();

        app.service = new Service();

        // TODO: move to load scene
        app.on('loading', ({progress}, {name}) => {
            log(`Progress: ${progress} %`);
            log(`Resource: ${name}`);
        });

        await app.service.login();

        //  Import Main Scene
        const [MainScene, initData] =
            await Promise.all([
                import('./game/scenes/main'),
                app.service.init(),
            ]);

        await app.resource.load(MainScene);

        const scene = MainScene.create(initData);

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
