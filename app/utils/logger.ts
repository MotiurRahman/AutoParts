// utils/logger.js
const isDevelopment = process.env.NODE_ENV === "development";

const logger = {
    log: (...args: any) => {
        if (isDevelopment) {
            console.log(...args);
        }
    },
    warn: (...args: any) => {
        if (isDevelopment) {
            console.warn(...args);
        }
    },
    error: (...args: any) => {
        console.error(...args);
    },
};

export default logger;
