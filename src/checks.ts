export function isPositive(number: number, name: string) {
    if (number < 0) {
        throw new Error(`${name} must be non-negative (got ${number})!`);
    }
}

export function isInteger(number: number, name: string): asserts number is number {
    if (!Number.isInteger(number)) {
        throw new Error(`${name} must be an integer (got ${number})!`);
    }
}

export function isNonZero(number: number, name: string) {
    if (number === 0) {
        throw new Error(`${name} must be non-zero!`);
    }
}
