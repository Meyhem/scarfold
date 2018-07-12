"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var fs_extra_1 = __importDefault(require("fs-extra"));
var config_1 = require("./config");
function assertExistTemplate(templatePath) {
    if (!fs_extra_1.default.existsSync(templatePath)) {
        throw new Error("Template file '" + templatePath + "' does not exists");
    }
}
function overrideProtect(path) {
    if (fs_extra_1.default.existsSync(path)) {
        throw new Error("Rendering destination '" + path + "' already exists, stopping.");
    }
}
function processVars(varDefs, vars) {
    // loop through "vars" section in config
    for (var varNameDef in varDefs) {
        // does not have default, not provided in CLI parameter
        if (typeof varDefs[varNameDef].default === 'undefined' &&
            typeof vars[varNameDef] === 'undefined') {
            throw new Error("Var '" + varNameDef + "' does not have default value and must be provided as CLI parameter '--" + varNameDef + " <value>'");
        }
        // has default, not provided in CLI parameter
        else if (typeof varDefs[varNameDef].default !== 'undefined') {
            // use default value
            vars[varNameDef] = varDefs[varNameDef].default;
        }
    }
}
function assertUniqueDestPaths(cmd) {
    var dupes = [];
    var dests = cmd.render.map(function (rnd) { return rnd.dest; });
    dests.map(function (dest, i) {
        if (dests.lastIndexOf(dest) !== i) {
            dupes.push(dest);
        }
    });
    if (dupes.length) {
        throw new Error("Found duplicate 'dest' paths in 'render', preventing accidental overrides during generation of: " + dupes.join(', '));
    }
}
function loadTemplate(templatePath) {
    return fs_extra_1.default.readFileSync(templatePath, { encoding: 'utf-8' });
}
function renderTemplate(templateContents, vars) {
    for (var varName in vars) {
        var reg = new RegExp("##" + varName + "##", 'gmi');
        var varValue = vars[varName];
        templateContents = templateContents.replace(reg, varValue);
    }
    return templateContents;
}
function writeTemplate(rendered, destPath) {
    fs_extra_1.default.mkdirpSync(path_1.default.dirname(destPath));
    fs_extra_1.default.writeFileSync(destPath, rendered);
}
var ScarfEngine = /** @class */ (function () {
    function ScarfEngine() {
    }
    ScarfEngine.prototype.gen = function (command, vars) {
        var templateCommand = config_1.config.scaffolding[command];
        var templateFolder = config_1.config.templateFolder || 'templates';
        if (!templateCommand) {
            throw new Error("Scaffolding command '" + command + "' does not exist in scarfold file");
        }
        var renderItems = templateCommand.render;
        // check
        assertUniqueDestPaths(templateCommand);
        processVars(templateCommand.vars, vars);
        for (var _i = 0, renderItems_1 = renderItems; _i < renderItems_1.length; _i++) {
            var renderItem = renderItems_1[_i];
            var templatePath = path_1.default.join(templateFolder, renderItem.template);
            var destinationPath = renderTemplate(renderItem.dest, vars);
            assertExistTemplate(templatePath);
            overrideProtect(destinationPath);
        }
        // execution
        for (var _a = 0, renderItems_2 = renderItems; _a < renderItems_2.length; _a++) {
            var renderItem = renderItems_2[_a];
            var templatePath = path_1.default.join(templateFolder, renderItem.template);
            var destinationPath = renderTemplate(renderItem.dest, vars);
            var rendered = renderTemplate(loadTemplate(templatePath), vars);
            writeTemplate(rendered, destinationPath);
        }
    };
    return ScarfEngine;
}());
exports.ScarfEngine = ScarfEngine;
