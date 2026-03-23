export const ipValidator = (input: string[]) => {
    if (input.length != 4) {
        return false
    }
    return input.every(el => parseInt(el) >= 0 && parseInt(el) <= 255)
}