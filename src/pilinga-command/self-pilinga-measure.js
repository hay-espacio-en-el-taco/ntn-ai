const SMALL_PILINGA_RATE = 0.50; // 50% chance of small pilinga
const SMALL_PILINGA_MAX_SIZE = 10; // Size in centimeters
const MAX_EXTRA_PILINGA_AMOUNT = 17; // Size in centimeters. Extra amount after small pilinga size.
const BIG_PILINGA_MIN_SIZE = 18; // Size in centimeters
const PILINGA_INSIDE_RATE = 0.30 // 30% chance of pilinga being inside

const RESPONSES = {
    'ZERO_PILINGA': (tagFn) => ([
        `404 - Pilinga Not Found`,
        tagFn `<@${'userId'}> tiene humillantes 0cm de pilinga`,
        tagFn `Pa' qué le mides <@${'userId'}> si no hay nada allí, no te humilles más.`,
    ]),
    'SMALL_PILINGA': (tagFn) => ([
        tagFn `Te mide ${'pilingaSize'}cm`,
        tagFn `A <@${'userId'}> le mide unos pobres ${'pilingaSize'}cm pilinga`,
    ]),
    'AVERAGE_LUCK_MESSAGES': (tagFn) => ([
        tagFn `Te mide ${'pilingaSize'}cm`,
        tagFn `A <@${'userId'}> le mide ${'pilingaSize'}cm de rica pilinga`,
        tagFn `<@${'userId'}> tiene un sable de ${'pilingaSize'}cm`,
    ]),
    'BIG_PILINGA': (tagFn) => ([
        tagFn `Te mide ${'pilingaSize'}cm`,
        tagFn `<@${'userId'}> tiene unos impresionantes ${'pilingaSize'}cm de rica pilinga`,
        tagFn `<@${'userId'}> tiene un sablesote de ${'pilingaSize'}cm`,
    ]),
    'BIG_PILINGA_BUT_INSIDE': (tagFn) => ([
        tagFn `<@${'userId'}> tiene unos impresionantes ${'pilingaSize'}cm de rica pilinga... ¡Pero adentro!`,
    ]),
};

const templateString = (strings, ...keys) => (
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

function getSize() {
    const isBadLuck = Math.random() <= SMALL_PILINGA_RATE;

    let pilingaLength;
    if (isBadLuck) {
        pilingaLength = SMALL_PILINGA_MAX_SIZE * Math.random();
    } else {
        pilingaLength = SMALL_PILINGA_MAX_SIZE + MAX_EXTRA_PILINGA_AMOUNT * Math.random();
    }

    pilingaLength = Math.floor(pilingaLength); // Remove decimals

    return pilingaLength;
}

function makeItFunny(pilingaSize, userId) {
    let type = 'AVERAGE_LUCK_MESSAGES';
    if (pilingaSize === 0) {
        type = 'ZERO_PILINGA';
    } else if (pilingaSize >= BIG_PILINGA_MIN_SIZE) {
        const isPilingaInside = Math.random() <= PILINGA_INSIDE_RATE;
        type = isPilingaInside ? 'BIG_PILINGA_BUT_INSIDE' : 'BIG_PILINGA';
    } else if (pilingaSize <= SMALL_PILINGA_MAX_SIZE) {
        type = 'SMALL_PILINGA';
    }

    const responsesAvailable = RESPONSES[type](templateString);
    const responseIdx = Math.floor(Math.random() * responsesAvailable.length); // Pick one randomly
    const template = responsesAvailable[responseIdx];

    if (typeof template === 'string') {
        return template;
    }

    return template({pilingaSize, userId});
}

export default function(userId) {
    const pilingaSize = getSize();
    return makeItFunny(pilingaSize, userId);
}
