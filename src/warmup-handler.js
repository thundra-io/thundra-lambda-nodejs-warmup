class WarmupHandler {
    constructor(extraCallback, options) {
        this.extraCallback = extraCallback;
        options = options ? options : {};
        options.logEnabled = options.logEnabled === undefined ? true : options.logEnabled;
        this.options = options;
        this.defaultDelayInMs = 100;
    }

    setTimeoutEvent = (callback, delayInMs) => {
        setTimeout(() => {
            if (typeof this.extraCallback === "function"){
                this.extraCallback();
            }
            callback();
        }, delayInMs);
    };

    log = (message, optionalParam) => {
        if (this.options.logEnabled){
            console.log(message, optionalParam);
        }
    };

    handleEmptyWarmupRequest = (callback) => {
        this.log("Thundra Warmup: %d ms delay", this.defaultDelayInMs);
        this.setTimeoutEvent(callback, this.defaultDelayInMs);
    };

    handleNonemptyWarmupRequest = (event, callback) => {
        let delayInMs = this.defaultDelayInMs;
        let warmupArgs = event.substring("#warmup".length).trim().split(/\s+/);

        warmupArgs.forEach(arg => {
            const argParts = arg.split("=");
            if (argParts.length === 2 && argParts[0] === "wait")
                delayInMs += parseInt(argParts[1]);
        });

        this.log("Thundra Warmup: %d ms delay", delayInMs);
        this.setTimeoutEvent(callback, delayInMs);
    };

    checkAndHandleWarmupRequest = (event, callback) => {
        let isWarmupRequest = false;
        if (Object.keys(event).length === 0 && event.constructor === Object) {
            this.handleEmptyWarmupRequest(callback);
            isWarmupRequest = true;
        } else if (typeof event === "string" && event.startsWith("#warmup")) {
            this.handleNonemptyWarmupRequest(event, callback);
            isWarmupRequest = true;
        }
        return isWarmupRequest;
    };
}

export default WarmupHandler;