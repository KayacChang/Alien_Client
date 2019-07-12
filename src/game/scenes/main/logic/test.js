import {spin} from './spin';
import {show} from './show';
import {log} from '../../../../general';

export async function test({symbols, reels, effects}) {
    const result = process(symbols);

    await spin(reels, result);

    show(effects, symbols);

    log('Round Complete...');
    app.emit('Idle');
}
