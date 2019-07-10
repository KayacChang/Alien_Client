import {symbolConfig} from '../data';

function getSymbolNameBy(icon) {
    return symbolConfig
        .find(({id}) => id === icon)
        .name;
}

export function show(effects, icons) {
    icons.forEach((icon, index) => {
        const effect = effects[index];

        let name = getSymbolNameBy(icon);

        if (name === 'empty') return;

        let anim = 'anim';

        if (name.includes('wild')) {
            [name, anim] = name.split('@');
        }

        const tar = effect.getChildByName(name);

        if (name.includes('wild')) {
            tar.getChildByName('combo')
                .children
                .forEach((view) => view.visible = false);
        }

        const animation = tar.transition[anim];

        tar.visible = true;
        animation.restart();

        app.on('SpinStart', () => {
            tar.visible = false;
            animation.pause();
        });
    });
}
