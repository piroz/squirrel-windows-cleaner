class Clean {

    constructor() {
        this.fs = require("fs");
        this.script = `
var fs = new ActiveXObject("Scripting.FileSystemObject");

if (WScript.Arguments.length < 1) {
    WScript.Quit(-1);
}

var basedir =  WScript.Arguments.item(0);
var dir = fs.GetFolder(basedir);
var files = new Enumerator(dir.SubFolders);
var current;
var appdir = [];

for(; !files.atEnd(); files.moveNext()){
    current = files.item().Name;

    if (current.match(/^app\-/) !== null) {
        appdir.push(("" + current).replace(/app-/g, ""));
    }
}

var numalize = function(version) {
    var part = version.split(".");
    var multiplar = 1;
    var num = 0;

    part.reverse();

    for (var i in part) {

        if (part[i] > 0) {
            num += ~~part[i] * multiplar;
        }

        multiplar = multiplar * Math.pow(10, ("" + part[i]).length);
    }

    return num;
};

appdir.sort(function(a, b) {
    var num_a = numalize(a);
    var num_b = numalize(b);

    if (num_a > num_b) return -1;
    if (num_a < num_b) return 1;
    return 0;
});

var dontRemove1 = appdir.shift();
var dontRemove2 = appdir.shift();

for (var i in appdir) {
    fs.DeleteFolder(basedir + "\\\\app-" + appdir[i]);
}

fs = null;
`;
        this.cp = require("child_process");
        this.path = require("path");
        this.os = require("os");
        this.script_path = this.path.resolve(this.os.tmpdir(), "cleanapp.js");
    }

    run(basedir) {
        if (this.os.platform() !== "win32") {
            throw new Error("Sorry. This module current support win32 platform only")
        }

        this.fs.writeFileSync(this.script_path, this.script);

        var child = this.cp.spawn("wscript", [this.script_path, basedir], { detached: true });
    }
}

module.exports = Clean;