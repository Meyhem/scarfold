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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var yargs = __importStar(require("yargs"));
var config_1 = require("./config");
var engine_1 = require("./engine");
var fsUtil_1 = require("./fsUtil");
var util_1 = __importDefault(require("./util"));
/**
 * @description Main functionality, runs scaffolding engine for given template and vars
 */
function runEngine() {
    try {
        // load scarfold.json
        config_1.loadConfig();
        var fsUtil = new fsUtil_1.FsUtil();
        // initialize engine
        var engine = new engine_1.ScarfEngine(fsUtil, config_1.config, {
            override: cli.override,
        });
        // dupe cli arguments from yargs
        var vars = __assign({}, cli);
        // remove properties provided by yargs, and reserved options
        delete vars._;
        delete vars.$0;
        delete vars.override;
        // run generation
        engine.gen(cli._[0], vars);
    }
    catch (e) {
        console.error(chalk_1.default.red(e.message));
        process.exit(1);
    }
}
var cli = yargs.usage('Usage: $0 <template> [options] [variables]')
    .command('init', 'initialize the scarfold environment (create scarfold.json and templates folder)')
    .command('<template>', 'scaffold a <template>', function (args) {
    return args.demandCommand();
})
    .demandCommand(1)
    .option('override', {
    coerce: Boolean,
    default: false,
    description: 'turns off existing file protection (can override existing files). !DATA LOSS DANGER!',
})
    .help('h')
    .alias('h', 'help')
    .example('$0', 'some_template --var1 4 --var2 7')
    .argv;
switch (cli._[0]) {
    case 'init':
        util_1.default.createEnvironment();
        break;
    default:
        runEngine();
        break;
}
