const SMALL_PILINGA_RATE = 0.10; // 10% chance of small pilinga
const SMALL_PILINGA_MAX_SIZE = 10; // Size in centimeters
const MAX_EXTRA_PILINGA_AMOUNT = 17; // Size in centimeters. Extra amount after small pilinga size.
const BIG_PILINGA_MIN_SIZE = 18; // Size in centimeters
const PILINGA_INSIDE_RATE = .69 // 69% chance of pilinga being inside

const RESPONSES = {
    'ZERO_PILINGA': (tagFn) => ([
        tagFn `<@${'idOfWhoRequested'}> buscó la pilinga de <@${'otherUserId'}> y no la encontró - Error 404`,
        tagFn `<@${'idOfWhoRequested'}> se da cuenta que <@${'otherUserId'}> tiene unos decepcionantes 0cm de pilinga`,
        tagFn `Pa' qué le mides la pilinga a <@${'otherUserId'}> si no hay nada allí, no lo humilles más.`,
    ]),
    'SMALL_PILINGA': (tagFn) => ([
        tagFn `<@${'idOfWhoRequested'}> se asoma y sólo ve los tristes ${'pilingaSize'}cm de <@${'otherUserId'}>`,
        tagFn `<@${'idOfWhoRequested'}> se asoma en los pantalones de <@${'otherUserId'}> y ve unos pobres ${'pilingaSize'}cm de pilinga`,
    ]),
    'AVERAGE_LUCK_MESSAGES': (tagFn) => ([
        tagFn `<@${'idOfWhoRequested'}> agarra los ${'pilingaSize'}cm de <@${'otherUserId'}>`,
        tagFn `<@${'idOfWhoRequested'}> sostiene el sable de ${'pilingaSize'}cm de <@${'otherUserId'}>`,
    ]),
    'BIG_PILINGA': (tagFn) => ([
        tagFn `<@${'idOfWhoRequested'}> agarra los impresionantes ${'pilingaSize'}cm de <@${'otherUserId'}>`,
        tagFn `<@${'idOfWhoRequested'}> sostiene el sablesote de ${'pilingaSize'}cm de <@${'otherUserId'}>`,
        tagFn `<@${'idOfWhoRequested'}> casi se atraganta con los ${'pilingaSize'}cm de tremenda pilinga de <@${'otherUserId'}>`,
        tagFn `<@${'idOfWhoRequested'}> se pica el ojo con tremendos ${'pilingaSize'}cm pilinga de <@${'otherUserId'}>`,
    ]),
    'BIG_PILINGA_BUT_INSIDE': (tagFn) => ([
        tagFn `<@${'idOfWhoRequested'}> intenta medir pero se tropieza y cae encima de los impresionantes ${'pilingaSize'}cm de rica pilinga de <@${'otherUserId'}>`,
        tagFn `<@${'idOfWhoRequested'}> sostiene el sablesote de ${'pilingaSize'}cm de <@${'otherUserId'}> y le da un beso de la emoción`,
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

function makeItFunny(pilingaSize, idOfWhoRequested, otherUserId) {
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

    return template({pilingaSize, idOfWhoRequested, otherUserId});
}

export default function(idOfWhoRequested, otherUserId) {
    const pilingaSize = getSize();
    return makeItFunny(pilingaSize, idOfWhoRequested, otherUserId);
}
