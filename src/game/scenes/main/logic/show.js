import {symbolConfig} from '../data';

export function show(effects, icons) {
    icons.forEach((icon, index) => {
        const effect = effects[index];

        let {name} = symbolConfig.find(({id}) => id === icon);

        let anim = 'anim';

        if (name.includes('wild')) {
            [name, anim] = name.split('@');
        }

        if (name.includes('alien')) {
            name = 'alien';
            anim = 'right';
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
