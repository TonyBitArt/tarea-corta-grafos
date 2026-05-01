export function randomSample(list, num) {
    const newList = [...list];
    const sample = [];

    for (let i = 0; i < num; i++) {
        let randomIndex = Math.floor(Math.random() * newList.length);
        sample.push(newList.splice(randomIndex, 1)[0]);
    }

    return sample;
}

export function randint(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}