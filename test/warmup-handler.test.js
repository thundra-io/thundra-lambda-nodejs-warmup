/* eslint-disable no-console */
import WarmupHandler from "../src/warmup-handler";

let consoleOutput;
console["log"] = jest.fn(input => (consoleOutput = input));
jest.useFakeTimers();

describe("WarmupHandler", () => {
    describe("constructor", () => {
        const warmupHandler = new WarmupHandler();
        const extraCallback = jest.fn();
        const warmupHandlerWithExtraCallback = new WarmupHandler(extraCallback);
        it("should initialize variables correctly", () => {
            expect(warmupHandler.defaultDelayInMs).toEqual(100);
            expect(warmupHandler.extraCallback).not.toBeDefined();
            expect(warmupHandlerWithExtraCallback.defaultDelayInMs).toEqual(100);
            expect(warmupHandlerWithExtraCallback.extraCallback).toBe(extraCallback);

        });
    });


    describe("setTimeoutEvent", () => {
        describe("without extra callback", () => {
            const warmupHandler = new WarmupHandler();
            const callback = jest.fn();
            const delayInMs = 150;
            warmupHandler.setTimeoutEvent(callback, delayInMs);
            jest.runAllTimers();
            it("should call callback after delayInMs", () => {
                expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), delayInMs);
                expect(callback).toHaveBeenCalledTimes(1);
            });
        });
        describe("with extra callback", () => {
            const extraCallback = jest.fn();
            const warmupHandler = new WarmupHandler(extraCallback);
            const callback = jest.fn();
            const delayInMs = 150;
            warmupHandler.setTimeoutEvent(callback, delayInMs);
            jest.runAllTimers();
            it("should call callback and extraCallback after delayInMs", () => {
                expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), delayInMs);
                expect(callback).toHaveBeenCalledTimes(1);
                expect(extraCallback).toHaveBeenCalledTimes(1);
            });
        });
    });


    describe("handleEmptyWarmupRequest", () => {
        const warmupHandler = new WarmupHandler();
        const callback = jest.fn();
        warmupHandler.setTimeoutEvent = jest.fn();
        warmupHandler.handleEmptyWarmupRequest(callback);
        it("should call setTimeoutEvent with callback and defaultDelayInMs", () => {
            expect(warmupHandler.setTimeoutEvent).toHaveBeenCalledTimes(1);
            expect(warmupHandler.setTimeoutEvent).toHaveBeenLastCalledWith(callback, warmupHandler.defaultDelayInMs);
        });

    });


    describe("handleNonemptyWarmupRequest", () => {
        describe("without extra delay", () => {
            const warmupHandler = new WarmupHandler();
            const callback = jest.fn();
            warmupHandler.setTimeoutEvent = jest.fn();
            const event = "#warmup";
            warmupHandler.handleNonemptyWarmupRequest(event, callback);
            it("should call setTimeoutEvent with callback and defaultDelayInMs", () => {
                expect(warmupHandler.setTimeoutEvent).toHaveBeenCalledTimes(1);
                expect(warmupHandler.setTimeoutEvent).toHaveBeenLastCalledWith(callback, warmupHandler.defaultDelayInMs);
            });
        });
        describe("with extra delay", () => {
            const warmupHandler = new WarmupHandler();
            const callback = jest.fn();
            warmupHandler.setTimeoutEvent = jest.fn();
            const extraDelay = 50;
            const event = "#warmup wait=" + extraDelay;
            warmupHandler.handleNonemptyWarmupRequest(event, callback);
            it("should call setTimeoutEvent with callback and defaultDelayInMs + extraDelay", () => {
                expect(warmupHandler.setTimeoutEvent).toHaveBeenCalledTimes(1);
                expect(warmupHandler.setTimeoutEvent).toHaveBeenLastCalledWith(callback, warmupHandler.defaultDelayInMs + extraDelay);
            });
        });
    });

    describe("checkAndHandleWarmupRequest", () => {
        describe("when it is warmup", () => {
            describe("with empty request message", () => {
                const warmupHandler = new WarmupHandler();
                const callback = jest.fn();
                const event = {};
                warmupHandler.handleEmptyWarmupRequest = jest.fn();
                warmupHandler.handleNonemptyWarmupRequest = jest.fn();
                const isWarmup = warmupHandler.checkAndHandleWarmupRequest(event,callback);
                it("should call handleEmptyWarmupRequest", () => {
                    expect(isWarmup).toBe(true);
                    expect(warmupHandler.handleEmptyWarmupRequest).toHaveBeenCalledWith(callback);
                    expect(warmupHandler.handleNonemptyWarmupRequest).not.toBeCalled();

                });
            });
            describe("with nonempty request message", () => {
                const warmupHandler = new WarmupHandler();
                const callback = jest.fn();
                const event = "#warmup";
                warmupHandler.handleEmptyWarmupRequest = jest.fn();
                warmupHandler.handleNonemptyWarmupRequest = jest.fn();
                const isWarmup = warmupHandler.checkAndHandleWarmupRequest(event,callback);
                it("should call handleNonemptyWarmupRequest", () => {
                    expect(isWarmup).toBe(true);
                    expect(warmupHandler.handleNonemptyWarmupRequest).toHaveBeenCalledWith(event,callback);
                    expect(warmupHandler.handleEmptyWarmupRequest).not.toBeCalled();

                });
            });
        });

        describe("when it is not a warmup", () => {
            const warmupHandler = new WarmupHandler();
            const callback = jest.fn();
            const event = {key: "value"};
            warmupHandler.handleEmptyWarmupRequest = jest.fn();
            warmupHandler.handleNonemptyWarmupRequest = jest.fn();
            const isWarmup = warmupHandler.checkAndHandleWarmupRequest(event,callback);
            it("should not call handleEmptyWarmupRequest or handleNonemptyWarmupRequest", () => {
                expect(isWarmup).toBe(false);
                expect(warmupHandler.handleEmptyWarmupRequest).not.toBeCalled();
                expect(warmupHandler.handleNonemptyWarmupRequest).not.toBeCalled();

            });
        });


    });

});