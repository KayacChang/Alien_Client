const reel = {
    'normalreel': [
        [5, 5, 6, 5, 7, 0, 6, 5, 5, 6, 5, 6, 7, 5, 7, 6, 5, 7, 6, 7, 7, 6, 5, 6, 0, 7, 5, 5, 5, 7, 7, 5, 7, 5, 7, 7, 5, 7, 5, 6, 0, 6],
        [6, 5, 7, 1, 6, 6, 7, 5, 1, 6, 7, 5, 7, 6, 5, 6, 7, 5, 6, 5, 5, 6, 7, 7, 7, 7, 1, 6, 7, 6, 1, 6, 6, 7, 6, 6, 7, 7, 5, 1, 7, 1, 5, 1, 7, 5],
        [6, 6, 5, 5, 5, 0, 5, 6, 5, 6, 5, 5, 7, 5, 6, 7, 0, 6, 7, 5, 7, 5, 7, 6, 5, 7, 6, 7, 6, 7, 6, 7, 5, 0, 7, 5, 6, 7, 6, 7, 5, 6, 5, 5],
    ],
};

addEventListener('message', ({data}) => {
    const func = {
        'account/login': onLogin,
        'lobby/init': onInit,
        'game/gameresult': onGameResult,
    }[data.type];

    if (func) return postMessage(func(data));
});

function onLogin() {
    return {};
}

function onInit() {
    return {reel};
}

function onGameResult() {

}
