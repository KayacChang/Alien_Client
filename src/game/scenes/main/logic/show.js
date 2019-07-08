import {symbolConfig} from '../data';

export function show(effects, icons) {
    icons.forEach((icon, index) => {
        const effect = effects[index];

        let {name} = symbolConfig.find(({id}) => id === icon);

        let anim = 'anim';

        if (name.includes('wild')) {
            [name, anim] = name.split('@');
        }

        if (name === 'alien') {
            anim = 'left';
        }

        const tar = effect.getChildByName(name);
        const animation = tar.transition[anim];

        if (name === 'wild') {
            tar.getChildByName('combo')
                .children
                .forEach((el) => el.visible = false);
        }

        tar.visible = true;
        animation.restart();

        app.on('SpinStart', () => {
            tar.visible = false;
            animation.pause();
        });

        if (name === 'alien') {
            const alien = effect.getChildByName(anim);

            const alienAnim = alien.transition['anim'];

            animation.finished
                .then(() => {
                    alien.visible = true;
                    alienAnim.restart();
                });

            app.on('SpinStart', () => {
                alien.visible = false;
                alienAnim.pause();
            });
        }
    });
}
