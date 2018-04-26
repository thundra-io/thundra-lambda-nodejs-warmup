import WarmupHandler from "./warmup-handler";

module.exports = extraCallback => {
    return originalFunction => {
        const warmupHandler = new WarmupHandler(extraCallback);
        return async (event, context, callback) => {
            const warmupCallback = typeof callback === "function" ? callback : context.succeed;
            if (!warmupHandler.checkAndHandleWarmupRequest(event, warmupCallback)) {
                await originalFunction(event, context, callback);
            }
        };
    };
};