import { quote, keys } from 'stores';

const client = new WebSocket('wss://api.exchange.bitcoin.com/api/2/ws');

export const initWs = () => {
    client.onopen = () => {
        getSymbols();
        console.log('socket connected');
    };
    client.onmessage = (msg): void => {
        const message = JSON.parse(msg.data);
        if (!message.error) {
            if (message.method === 'ticker') {
                quote.updateStore(message.params);
            }
            else if (typeof message.result !== 'boolean') {
                const symbols = message.result;
                keys.init(symbols);

            };
        }
    };
};

export const subscribe = (id: string) => {
    const message = {
        method: "subscribeTicker", params: {
            symbol: id
        }
    }
    const json = JSON.stringify(message);
    client.send(json)
}
export const unsubscribe = (id: string) => {
    quote.unsubscribeQuote(id);

    const message = {
        method: "unsubscribeTicker", params: {
            symbol: id
        }
    }
    const json = JSON.stringify(message);
    client.send(json);
}

export const close = (): void => {
    client.close(1000, 'click lol')
};

export const getSymbols = (): void => {
    const message = JSON.stringify({ method: 'getSymbols' });
    client.send(message)
};
