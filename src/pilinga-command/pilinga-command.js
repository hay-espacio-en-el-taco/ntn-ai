import getMeasureOfYourself from './self-pilinga-measure.js'
import getMeasureOfSomeoneElse from './measure-another-user.js'

export default function(body) {
    const hasUserAsInput = body?.data?.options?.length;
    const userId = body?.member?.user?.id;
    
    const userToWhomYouMeasure = hasUserAsInput ? body?.data?.options[0]?.value : null;
    const isFromSomeOneElse = userToWhomYouMeasure && userId !== userToWhomYouMeasure
    const shouldMesaureOtherPerson = hasUserAsInput && isFromSomeOneElse

    const msgFn = shouldMesaureOtherPerson ? getMeasureOfSomeoneElse : getMeasureOfYourself;

    return {
        content: msgFn(userId, userToWhomYouMeasure)
    };
}
