"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var util_1 = __importDefault(require("./util"));
var jsonschema_1 = require("jsonschema");
var rootSchema = {
    id: '/root',
    type: 'object',
    additionalProperties: false,
    properties: {
        templateFolder: { type: 'string' },
        graceful: { type: 'boolean' },
        scaffolding: {
            type: 'object',
            additionalProperties: {
                type: 'object',
                additionalProperties: false,
                properties: {
                    render: {
                        type: 'array',
                        items: {
                            type: 'object',
                            additionalProperties: { type: 'string' }
                        }
                    },
                    vars: {
                        type: 'object',
                        additionalProperties: {
                            type: 'object',
                            additionalProperties: false,
                            properties: {
                                default: { type: ['string', 'number', 'boolean', 'null'] }
                            }
                        }
                    }
                }
            }
        }
    }
};
function loadConfig() {
    var contents = fs_1.default.readFileSync('scarfold.json', { encoding: 'utf-8' });
    var cfg;
    cfg = JSON.parse(contents);
    // lowercase all vars
    if (cfg && cfg.scaffolding) {
        var cmds = Object.keys(cfg.scaffolding);
        cmds.map(function (cmd) {
            if (cfg.scaffolding[cmd].vars) {
                cfg.scaffolding[cmd].vars = util_1.default.lowercaseKeys(cfg.scaffolding[cmd].vars);
            }
        });
    }
    var result = validateConfig(cfg);
    if (result.errors && result.errors.length) {
        var errStr = 'Invalid scarfold config file:\n';
        errStr = result.errors
            .map(function (err) { return err.property + " " + err.message; })
            .join('\n');
        throw new Error(errStr);
    }
    exports.config = cfg;
}
exports.loadConfig = loadConfig;
function validateConfig(cfg) {
    var v = new jsonschema_1.Validator();
    return v.validate(cfg, rootSchema, { propertyName: 'scarfold' });
}