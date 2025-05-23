const PREFIX = "[text-server]";

const DEBUG = !!import.meta.env.DEV;

const isEmpty = (list) =>
    !list.length || list.every((item) => !item || !item?.length);

export default {
    info: (...msg) => {
        if (!isEmpty(msg)) console.log(PREFIX, ...msg);
    },
    error: (...msg) => {
        if (!isEmpty(msg)) console.error(PREFIX, ...msg);
    },
    debug: (...msg) => {
        if (!isEmpty(msg) && DEBUG) console.debug(`${PREFIX} ${msg.join(" ")}`);
    },
};
