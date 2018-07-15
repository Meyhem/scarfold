"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.camelCase = function (context /*, options?: HelperOptions*/) {
    if (!context) {
        return '';
    }
    var val = context.toString();
    var words = val.split(' ').filter(function (x) { return !!x; });
    return words.map(function (w) {
        var components = w.split('-').filter(function (x) { return !!x; });
        return components.map(function (c, i) {
            if (i === 0) {
                return c.charAt(0).toLowerCase() + c.slice(1);
            }
            else {
                return c.charAt(0).toUpperCase() + c.slice(1);
            }
        }).join('');
    }).join(' ');
};
exports.pascalCase = function (context /*, options?: HelperOptions*/) {
    if (!context) {
        return '';
    }
    var val = context.toString();
    var words = val.split(' ').filter(function (x) { return !!x; });
    return words.map(function (w) {
        var components = w.split('-').filter(function (x) { return !!x; });
        return components.map(function (c) {
            return c.charAt(0).toUpperCase() + c.slice(1);
        }).join('');
    }).join(' ');
};
exports.noCase = function (context /*, options?: HelperOptions*/) {
    if (!context) {
        return '';
    }
    var val = context.toString();
    var words = val.split(' ').filter(function (x) { return !!x; });
    return words.map(function (w) {
        var components = w.split('-').filter(function (x) { return !!x; });
        return components.map(function (c) {
            return c;
        }).join('');
    }).join(' ');
};
