import anime from 'animejs';

const config = {
    duration: 1000,
    easing: 'easeOutExpo',
};

export function moveIn({targets, ...options}) {
    const param = {
        targets,

        ...(config),
        ...(options),
    };
    return anime(param);
}

export function moveOut({targets, ...options}) {
    const param = {
        targets,

        ...(config),
        ...(options),
    };
    return anime(param);
}
