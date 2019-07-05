import anime from 'animejs';

const config = {
    duration: 1000,
};

export function fadeIn({targets, ...options}) {
    const alpha = 1;

    const param = {
        targets,

        alpha,
        ...(config),
        ...(options),
    };

    return anime(param);
}

export function fadeOut({targets, ...options}) {
    const alpha = 0;

    const param = {
        targets,

        alpha,
        ...(config),
        ...(options),
    };

    return anime(param);
}
