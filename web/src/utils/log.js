const PREFIX = "[text-server]";

const DEBUG = !!import.meta.env.DEV;

const isEmpty = (list) => !list.length || list.every((item) => !item);

export default {
    info: (...msg) => {
        if (!isEmpty(msg)) console.log(PREFIX, ...msg);
    },
    error: (...msg) => {
        if (!isEmpty(msg)) console.error(PREFIX, ...msg);
    },
    debug: (msg) => {
        if (msg.length && DEBUG) console.debug(`${PREFIX} ${msg}`);
    },
};
