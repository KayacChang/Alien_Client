import INTERFACE_URL from '../../game/interface/sprite_sheets/interface.fui';
import INTERFACE_ATLAS0_URL from '../../game/interface/sprite_sheets/interface@atlas0.png';

import SPIN_MP3 from '../../game/interface/sounds/mp3/soft01.mp3';
import MENU_MP3 from '../../game/interface/sounds/mp3/menu01.mp3';
import CLICK_MP3 from '../../game/interface/sounds/mp3/hard01.mp3';
import CANCEL_MP3 from '../../game/interface/sounds/mp3/cancel01.mp3';

import SPIN_OGG from '../../game/interface/sounds/ogg/soft01.ogg';
import MENU_OGG from '../../game/interface/sounds/ogg/menu01.ogg';
import CLICK_OGG from '../../game/interface/sounds/ogg/hard01.ogg';
import CANCEL_OGG from '../../game/interface/sounds/ogg/cancel01.ogg';

import SPIN_WEBM from '../../game/interface/sounds/webm/soft01.webm';
import MENU_WEBM from '../../game/interface/sounds/webm/menu01.webm';
import CLICK_WEBM from '../../game/interface/sounds/webm/hard01.webm';
import CANCEL_WEBM from '../../game/interface/sounds/webm/cancel01.webm';

import {addPackage} from 'pixi_fairygui';

import {Main} from './main/main';
import {Menu} from './menu';

const fontsConfig = {
    google: {
        families: ['Candal', 'Basic'],
    },
};

const sounds = [
    {
        type: 'sound',
        subType: 'effects',
        name: 'spin',
        src: [
            SPIN_WEBM,
            SPIN_OGG,
            SPIN_MP3,
        ],
    },
    {
        type: 'sound',
        subType: 'effects',
        name: 'option',
        src: [
            MENU_WEBM,
            MENU_OGG,
            MENU_MP3,
        ],
    },
    {
        type: 'sound',
        subType: 'effects',
        name: 'click',
        src: [
            CLICK_WEBM,
            CLICK_OGG,
            CLICK_MP3,
        ],
    },
    {

        type: 'sound',
        subType: 'effects',
        name: 'cancel',
        src: [
            CANCEL_WEBM,
            CANCEL_OGG,
            CANCEL_MP3,
        ],
    },
];

export function reserve() {
    return [
        {name: 'interface.fui', url: INTERFACE_URL, xhrType: 'arraybuffer'},
        {name: 'interface@atlas0.png', url: INTERFACE_ATLAS0_URL},
        {name: 'font', url: '', metadata: fontsConfig},
        ...(sounds),
    ];
}

export function create() {
    const create = addPackage(app, 'interface');
    const it = create('UserInterface');

    it.menu = Menu(it);

    it.main = Main(it);

    app.control = it;

    return it;
}

