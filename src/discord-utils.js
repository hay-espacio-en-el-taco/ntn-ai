import fetch from 'node-fetch';

export const NoOp = () => {};

export async function DiscordRequest(endpoint, options) {
    // append endpoint to root API URL
    const url = 'https://discord.com/api/v10/' + endpoint;
    // Stringify payloads
    if (options.body) options.body = JSON.stringify(options.body);
    // Use node-fetch to make requests
    const res = await fetch(url, {
        headers: {
            Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
            'Content-Type': 'application/json; charset=UTF-8',
            'User-Agent': 'NTN ai (https://github.com/hay-espacio-en-el-taco/, 1.0.0)',
        },
        ...options
    });
    // throw API errors
    if (!res.ok) {
        const data = await res.json();
        console.log(res.status);
        throw new Error(JSON.stringify(data));
    }

    return res;
}

export async function deferredResponse(handlerFn, body) {
    const response = handlerFn(body);
    const { application_id, token } = body;

    await DiscordRequest(`/webhooks/${application_id}/${token}/messages/@original`, {
        method: 'PATCH',
        body: response
    });
}
