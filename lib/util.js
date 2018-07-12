"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var fs_extra_1 = __importDefault(require("fs-extra"));
var config_1 = require("./config");
exports.default = {
    createEnvironment: function () {
        try {
            if (!fs_extra_1.default.existsSync('scarfold.json')) {
                fs_extra_1.default.writeFileSync('scarfold.json', JSON.stringify(config_1.DEFAULT_CONFIG, null, 2));
                console.log(chalk_1.default.green('+ scarfold.json'));
            }
            else {
                console.log(chalk_1.default.green('\'scarfold.json\' already exists'));
            }
        }
        catch (e) {
            console.error(chalk_1.default.red("Unable to create 'scarfold.json': " + e.message));
        }
        try {
            if (!fs_extra_1.default.existsSync('templates')) {
                fs_extra_1.default.mkdirSync('templates');
                console.log(chalk_1.default.green('+ templates/'));
            }
            else {
                console.log(chalk_1.default.green('\'templates\' folder already exists'));
            }
        }
        catch (e) {
            console.error(chalk_1.default.red("Unable to create 'templates' folder: " + e.message));
        }
    },
};
