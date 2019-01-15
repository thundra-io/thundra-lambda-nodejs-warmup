import WarmupHandler from "./warmup-handler";

module.exports = (extraCallback, options) => {
    return originalFunction => {
        const warmupHandler = new WarmupHandler(extraCallback, options);
        return async (event, context, callback) => {
            const warmupCallback = typeof callback === "function" ? callback : context.succeed;
            if (!warmupHandler.checkAndHandleWarmupRequest(event, warmupCallback)) {
                return await originalFunction(event, context, callback);
            }
        };
    };
};