"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    lowercaseKeys: function (obj) {
        var key, keys = Object.keys(obj);
        var n = keys.length;
        var newobj = {};
        while (n--) {
            key = keys[n];
            newobj[key.toLowerCase()] = obj[key];
        }
        return newobj;
    }
};
