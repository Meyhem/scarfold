"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_extra_1 = __importDefault(require("fs-extra"));
var path_1 = __importDefault(require("path"));
var FsUtil = /** @class */ (function () {
    function FsUtil() {
    }
    FsUtil.prototype.loadFile = function (filePath) {
        return fs_extra_1.default.readFileSync(filePath, { encoding: 'utf-8' });
    };
    FsUtil.prototype.gFileWrite = function (content, destPath) {
        fs_extra_1.default.mkdirpSync(path_1.default.dirname(destPath));
        fs_extra_1.default.writeFileSync(destPath, content);
    };
    FsUtil.prototype.exists = function (filePath) {
        return fs_extra_1.default.existsSync(filePath);
    };
    return FsUtil;
}());
exports.FsUtil = FsUtil;
