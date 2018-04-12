/* eslint-disable no-console */
const ThundraWarmup = require("../src/index");


describe("ThundraWarmup library", () => {
    const warmupWrapper = ThundraWarmup();
    const handler = jest.fn();
    const wrappedHandler = warmupWrapper(handler);

    it("should export a function which returns a lambda function wrapper", () => {
        expect(typeof ThundraWarmup === "function").toBeTruthy();
        expect(typeof warmupWrapper === "function").toBeTruthy();
        expect(typeof wrappedHandler === "function").toBeTruthy();
    });

    describe("when it is warmup", () => {
        const handler = jest.fn();
        const wrappedHandler = warmupWrapper(handler);
        const event = {};
        const context = {};
        const callback = jest.fn();
        wrappedHandler(event, context, callback);
        it("should not call the original handler", () => {
            expect(handler).not.toBeCalled();
        });
    });

    describe("when it is not warmup", () => {
        const handler = jest.fn();
        const wrappedHandler = warmupWrapper(handler);
        const event = {key: "value"};
        const context = {};
        const callback = jest.fn();
        wrappedHandler(event, context, callback);
        it("should not call the original handler", () => {
            expect(handler).toBeCalled();
        });
    });

    describe("should support context.succeed", () => {
        const handler = jest.fn();
        const wrappedHandler = warmupWrapper(handler);
        const event = {key: "value"};
        const context = {succeed: jest.fn()};
        wrappedHandler(event, context);
        it("should call the original handler", () => {
            expect(handler).toBeCalled();
        });
    });

});




