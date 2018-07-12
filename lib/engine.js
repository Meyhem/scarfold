"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var fs_extra_1 = __importDefault(require("fs-extra"));
var handlebars_1 = __importDefault(require("handlebars"));
var path_1 = __importDefault(require("path"));
var config_1 = require("./config");
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
        this.assertUniqueDestPaths(templateCommand);
        this.processVars(templateCommand.vars, vars);
        for (var _i = 0, renderItems_1 = renderItems; _i < renderItems_1.length; _i++) {
            var renderItem = renderItems_1[_i];
            var templatePath = path_1.default.join(templateFolder, renderItem.template);
            var destinationPath = this.renderTemplate(renderItem.dest, vars);
            this.assertExistTemplate(templatePath);
            this.overrideProtect(destinationPath);
        }
        // execution
        for (var _a = 0, renderItems_2 = renderItems; _a < renderItems_2.length; _a++) {
            var renderItem = renderItems_2[_a];
            var templatePath = path_1.default.join(templateFolder, renderItem.template);
            var destinationPath = this.renderTemplate(renderItem.dest, vars);
            var rendered = this.renderTemplate(this.loadTemplate(templatePath), vars);
            this.writeTemplate(rendered, destinationPath);
            console.log(chalk_1.default.green("+ " + destinationPath));
        }
    };
    ScarfEngine.prototype.assertExistTemplate = function (templatePath) {
        if (!fs_extra_1.default.existsSync(templatePath)) {
            throw new Error("Template file '" + templatePath + "' does not exists");
        }
    };
    ScarfEngine.prototype.overrideProtect = function (protectedPath) {
        if (fs_extra_1.default.existsSync(protectedPath)) {
            throw new Error("Rendering destination '" + protectedPath + "' already exists, stopping.");
        }
    };
    ScarfEngine.prototype.processVars = function (varDefs, vars) {
        // loop through "vars" section in config
        for (var varNameDef in varDefs) {
            if (typeof varDefs[varNameDef].default === 'undefined' &&
                typeof vars[varNameDef] === 'undefined') {
                // does not have default, not provided in CLI parameter
                throw new Error("Var '" + varNameDef + "' does not have default value and must be provided as CLI parameter '--" + varNameDef + " <value>'");
            }
            else if (typeof varDefs[varNameDef].default !== 'undefined' &&
                // has default, not provided in CLI parameter
                typeof vars[varNameDef] === 'undefined') {
                // use default value
                vars[varNameDef] = varDefs[varNameDef].default;
            }
        }
    };
    ScarfEngine.prototype.assertUniqueDestPaths = function (cmd) {
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
    };
    ScarfEngine.prototype.loadTemplate = function (templatePath) {
        return fs_extra_1.default.readFileSync(templatePath, { encoding: 'utf-8' });
    };
    ScarfEngine.prototype.renderTemplate = function (templateContents, vars) {
        return handlebars_1.default.compile(templateContents)(vars);
    };
    ScarfEngine.prototype.writeTemplate = function (rendered, destPath) {
        fs_extra_1.default.mkdirpSync(path_1.default.dirname(destPath));
        fs_extra_1.default.writeFileSync(destPath, rendered);
    };
    return ScarfEngine;
}());
exports.ScarfEngine = ScarfEngine;
