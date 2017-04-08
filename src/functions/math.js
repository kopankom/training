// number -> number
const round = (prec) =>
    (v) => {
        let power = 10 ** prec;
        return Math.round(power * v) / power;
    }

export const roundTo2 = round(2);
export const roundTo4 = round(4);
