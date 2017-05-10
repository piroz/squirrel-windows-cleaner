const assert = require("assert");

const Clean = require("../");

describe("clean", function() {
    var c = new Clean();

    it("true", function() {
        assert.ok(true);
    });

    it("throw-test", function(){
        assert.throws(() => {
            c.run();
        }, Error, "Error Thrown");
    });
});