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
// function processVars(vars: any) {
// }
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
    ScarfEngine.prototype.gen = function (template, vars) {
        var templateCommand = config_1.config.scaffolding[template];
        var templateFolder = config_1.config.templateFolder || 'templates';
        if (!templateCommand) {
            throw new Error("Template '" + template + "' does not exist in scarfold file");
        }
        var renderKeys = Object.keys(templateCommand.render);
        // check
        for (var _i = 0, renderKeys_1 = renderKeys; _i < renderKeys_1.length; _i++) {
            var renderKey = renderKeys_1[_i];
            var templatePath = path_1.default.join(templateFolder, renderKey);
            var destinationPath = renderTemplate(templateCommand.render[renderKey], vars);
            assertExistTemplate(templatePath);
            overrideProtect(destinationPath);
        }
        // execution
        for (var _a = 0, renderKeys_2 = renderKeys; _a < renderKeys_2.length; _a++) {
            var renderKey = renderKeys_2[_a];
            var templatePath = path_1.default.join(templateFolder, renderKey);
            var destinationPath = renderTemplate(templateCommand.render[renderKey], vars);
            var rendered = renderTemplate(loadTemplate(templatePath), vars);
            writeTemplate(rendered, destinationPath);
        }
    };
    return ScarfEngine;
}());
exports.ScarfEngine = ScarfEngine;
