"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var handlebars_1 = __importDefault(require("handlebars"));
var path_1 = __importDefault(require("path"));
var hbsExtensions_1 = require("./hbsExtensions");
var ScarfEngine = /** @class */ (function () {
    function ScarfEngine(fsUtil, config, options) {
        this.fsUtil = fsUtil;
        this.config = config;
        // merge with default options
        this.options = __assign({ override: false }, options);
        // register helper functions
        handlebars_1.default.registerHelper('camelCase', hbsExtensions_1.camelCase);
        handlebars_1.default.registerHelper('pascalCase', hbsExtensions_1.pascalCase);
        handlebars_1.default.registerHelper('noCase', hbsExtensions_1.noCase);
    }
    /**
     * @param command string command, which engine will look up in scarfold.json file, loads it and executes it
     * @param vars dict that contains user defined variables for template
     * @throws Error object whether there is validation error
     */
    ScarfEngine.prototype.gen = function (command, vars) {
        // get command from config
        var templateCommand = this.config.scaffolding[command];
        // determine template folder, defaults to 'templates'
        var templateFolder = this.config.templateFolder || 'templates';
        if (!templateCommand) {
            throw new Error("Scaffolding command '" + command + "' does not exist in scarfold file");
        }
        // inidividual rendering items (mapping from which template to what destination)
        var renderItems = templateCommand.render;
        // checks
        // check whether there is a render destination colliding with another
        // that way they will override each other (latter wins)
        this.assertUniqueDestPaths(templateCommand);
        // validate and expand default vars
        this.processVars(templateCommand.vars, vars);
        for (var _i = 0, renderItems_1 = renderItems; _i < renderItems_1.length; _i++) {
            var renderItem = renderItems_1[_i];
            var templatePath = path_1.default.join(templateFolder, renderItem.template);
            // render destination path
            var destinationPath = this.renderTemplate(renderItem.dest, renderItem.dest, vars);
            // check whether template file exists
            this.assertExistTemplate(templatePath);
            if (!this.options.override) {
                // check whether destination file already exists (check disabled by --override option)
                this.overrideProtect(destinationPath);
            }
        }
        var writeTasks = [];
        // execution
        for (var _a = 0, renderItems_2 = renderItems; _a < renderItems_2.length; _a++) {
            var renderItem = renderItems_2[_a];
            var templatePath = path_1.default.join(templateFolder, renderItem.template);
            var destinationPath = this.renderTemplate(renderItem.dest, renderItem.dest, vars);
            // load and render template
            var rendered = this.renderTemplate(templatePath, this.loadTemplate(templatePath), vars);
            // we dont immediately write the file we first want to verify if templates have no errors
            // so we dont end up wih partially rendered renderItems
            writeTasks.push({
                destinationPath: destinationPath,
                rendered: rendered,
            });
        }
        for (var _b = 0, writeTasks_1 = writeTasks; _b < writeTasks_1.length; _b++) {
            var _c = writeTasks_1[_b], rendered = _c.rendered, destinationPath = _c.destinationPath;
            // write to file
            this.writeTemplate(rendered, destinationPath);
            console.log(chalk_1.default.green("+ " + destinationPath));
        }
    };
    ScarfEngine.prototype.assertExistTemplate = function (templatePath) {
        if (!this.fsUtil.exists(templatePath)) {
            throw new Error("Template file '" + templatePath + "' does not exists");
        }
    };
    ScarfEngine.prototype.overrideProtect = function (protectedPath) {
        if (this.fsUtil.exists(protectedPath)) {
            throw new Error("Rendering destination '" + protectedPath + "' already exists, stopping.");
        }
    };
    ScarfEngine.prototype.processVars = function (varDefs, vars) {
        var errors = [];
        // loop through "vars" section in config
        for (var varNameDef in varDefs) {
            if (typeof varDefs[varNameDef].default === 'undefined' &&
                typeof vars[varNameDef] === 'undefined') {
                // does not have default value, not provided in CLI parameter
                errors.push("Var '" + varNameDef + "' does not have default value and must be provided as CLI parameter '--" + varNameDef + " <value>'");
            }
            else if (typeof varDefs[varNameDef].default !== 'undefined' &&
                // has default value, not provided in CLI parameter
                typeof vars[varNameDef] === 'undefined') {
                // use default value
                vars[varNameDef] = varDefs[varNameDef].default;
            }
        }
        if (errors.length) {
            // report all required missing vars
            throw new Error(errors.join('\n'));
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
        return this.fsUtil.loadFile(templatePath);
    };
    ScarfEngine.prototype.renderTemplate = function (source, templateContents, vars) {
        try {
            return handlebars_1.default.compile(templateContents)(vars);
        }
        catch (e) {
            throw new Error("Template error (" + source + "): " + e.message);
        }
    };
    ScarfEngine.prototype.writeTemplate = function (rendered, destPath) {
        this.fsUtil.gFileWrite(rendered, destPath);
    };
    return ScarfEngine;
}());
exports.ScarfEngine = ScarfEngine;
