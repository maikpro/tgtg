export function sleep(s: number) {
    const ms = s * 1000;

    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
