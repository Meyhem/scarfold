"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var yargs = __importStar(require("yargs"));
var chalk_1 = __importDefault(require("chalk"));
var config_1 = require("./config");
var engine_1 = require("./engine");
var util_1 = __importDefault(require("./util"));
function engine() {
    try {
        config_1.loadConfig();
    }
    catch (e) {
        console.error(chalk_1.default.red(e.message));
        process.exit(1);
    }
    var engine = new engine_1.ScarfEngine();
    try {
        var vars = __assign({}, cli);
        delete vars._;
        delete vars['$0'];
        // vars = util.lowercaseKeys(vars)
        engine.gen(cli._[0], vars);
    }
    catch (e) {
        console.error(chalk_1.default.red(e.message));
    }
}
var cli = yargs.usage('Usage: $0 <template> [options] [variables]')
    .demandCommand(1)
    .help('h')
    .alias('h', 'help')
    .example('$0', 'some_template --var1 4 --var2 7')
    .argv;
switch (cli._[0]) {
    case 'init':
        util_1.default.createEnvironment();
        break;
    default:
        engine();
        break;
}
