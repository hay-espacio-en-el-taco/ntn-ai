export const templateString = (strings, ...keys) => (
    (dict = {}) => {
        var result = [strings[0]];
        keys.forEach(
            (key, i) => {
                result.push(dict[key], strings[i + 1])
            }
        );
        return result.join('');
    }
);

export const SMALL_PILINGA_MAX_SIZE = 10; // Size in centimeters
export const MAX_EXTRA_PILINGA_AMOUNT = 17; // Size in centimeters. Extra amount after small pilinga size.
export const BIG_PILINGA_MIN_SIZE = 18; // Size in centimeters
