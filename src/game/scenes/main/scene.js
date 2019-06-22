import {addPackage} from 'pixi_fairygui';
import {SlotMachine} from './components/slot';

export function create() {
    const create = addPackage(app, 'main');
    const scene = create('MainScene');

    SlotMachine(
        scene.getChildByName('SlotBase')
    );

    return scene;
}
