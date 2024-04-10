import getMeasureOfYourself from './self-pilinga-measure.js'
import getMeasureOfSomeoneElse from './measure-another-user.js'

const LOADING_STATE_RESPONSES = [
    'midiendo...',
    'midiendo tu pilinga...',
    'sacando la cinta de medir...',
    'yendo por la regla para medirla...',
];

export function generatePilingaSizingTextResponse() {
    const responseIdx = Math.floor(Math.random() * LOADING_STATE_RESPONSES.length); // Pick one randomly
    return LOADING_STATE_RESPONSES[responseIdx];
}

export default function(body) {
    const isFromSomeOneElse = body?.data?.options?.length;
    const msgFn = isFromSomeOneElse ? getMeasureOfSomeoneElse : getMeasureOfYourself;

    const userId = body?.member?.user?.id;
    const userToWhomYouMeasure = body?.data?.options[0]?.value;

    return {
        content: msgFn(userId, userToWhomYouMeasure)
    };
}
