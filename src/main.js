import 'core-js/stable';
import 'regenerator-runtime/runtime';
import {select, remove, fetchJSON, isProduction} from './general';

import {App} from './system/application';
import {Service} from './service/01';
import {enableFullScreenMask} from './system/modules/screen';

import ENV_URL from './env.json';

const key = process.env.KEY;

async function main() {
    //  Init App
    try {
        document.title = 'For Every Gamer | 61 Studio';

        const res = await fetchJSON(ENV_URL);

        global.ENV = {
            SERVICE_URL:
                isProduction() ? res['prodServerURL'] : res['devServerURL'],

            LOGIN_TYPE: res['loginType'],
            GAME_ID: res['gameID'],
            I18N_URL: res['i18nURL'],
        };

        global.app = App();

        app.service = new Service(key);

        // Import Load Scene
        const LoadScene = await import('./game/scenes/load/scene');

        await app.resource.load(LoadScene);

        const comp = select('#app');
        const svg = select('#preload');
        remove(svg);

        comp.prepend(app.view);

        const loadScene = LoadScene.create();
        app.stage.addChild(loadScene);
        app.resize();

        enableFullScreenMask();

        await app.service.login({key});

        //  Import Main Scene
        const [MainScene, initData] =
            await Promise.all([
                import('./game/scenes/main'),
                app.service.init({key}),
            ]);

        await app.resource.load(MainScene);

        const scene = MainScene.create(initData);

        app.stage.addChildAt(scene, 0);

        app.stage.removeChild(loadScene);

        select('script').forEach(remove);

        app.resize();

        // document.title = translate('title');

        app.emit('Idle');
        //
    } catch (error) {
        console.error(error);

        // const msg = {title: error.message};

        // app.alert.error(msg);
    }
}

main();
