import {divide} from '../../../../general';

export function LoadingBar(view) {
    const mask = view.getChildByName('mask');

    return {
        get width() {
            return mask.width;
        },

        update,
    };

    function update(progress) {
        mask.scale.x = divide(progress, 100);
    }
}
