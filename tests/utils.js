const a = {
    current: 8,
    cycle: 10
};

const count = 2;
const newCurrent = (a.current + count) % a.cycle;
console.log('Current', newCurrent);
