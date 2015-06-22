// version 0.2
// splitOutside and parseExpression String methods
// Stephen Giles

(function() {

    String.prototype.splitOutside = function(delimiting_string, context, placeholder) {
        var string = this;
        if (!delimiting_string || typeof delimiting_string !== 'string') {
            return [string];
        }
        if (!placeholder || typeof placeholder !== 'string') {
            placeholder = "==---==";
        }
        var temp_placeholder = "===-===",
            splitter = "\\" + delimiting_string.split("").join("\\"),

            // replace delimiting_strings in quotes and brackets with placeholder
            parts = string

        // 'delimiting_string' in double quotes
            .replace(new RegExp("(" + splitter + ')(?=(?:[^"]|"[^"]*")*$)', "g"), temp_placeholder) //
            .replace(new RegExp(splitter, "g"), placeholder) //
            .replace(new RegExp(temp_placeholder, "g"), delimiting_string)

        // 'delimiting_string' in single quotes
        .replace(new RegExp("(" + splitter + ")(?=(?:[^']|'[^']*')*$)", 'g'), temp_placeholder) //
            .replace(new RegExp(splitter, "g"), placeholder) //
            .replace(new RegExp(temp_placeholder, "g"), delimiting_string)

        // 'delimiting_string' in []
        .replace(new RegExp(splitter + "(?=[^[\\]]*?\\])", "g"), placeholder)

        // 'delimiting_string' in {}
        .replace(new RegExp(splitter + "(?=[^{}]*?})", "g"), placeholder)

        // 'delimiting_string' in ()
        .replace(new RegExp(splitter + "(?=[^()]*?\\))", "g"), placeholder) //

        // split using delimiting_string
        .split(delimiting_string);

        // replace placeholders in quotes and brackets with delimiting_string 
        for (var i in parts) {
            parts[i] = parts[i].replace(new RegExp(placeholder, "g"), delimiting_string);
            if (typeof context !== 'undefined') {
                parts[i] = parts[i].parseExpression(context);
            }
        }
        return parts;
    };

    String.prototype.parseExpression = function(context) {
        var expression = this,
            trim = function(string) {
                return string.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
            },
            parser = function(expression) {
                var _parser = function(part_expression) {
                        var executable, args = [];
                        part_expression = trim(part_expression);

                        // if the expression has '(..)' treat as executable 
                        if (/\)$/.test(part_expression) && part_expression.indexOf("(") !== -1) {
                            part_expression = part_expression.substr(part_expression.indexOf("("));
                            executable = part_expression.substr(0, part_expression.indexOf("("));
                            args = trim(executable.replace(/[()]/g, ""));
                            if (args) {
                                args = args.splitOutside(",", context);
                            }
                        }

                        // expression is found in passed context
                        if (context && part_expression in context) {
                            if (typeof context[part_expression] === 'function' && executable) {
                                return context[part_expression].apply(context, args);
                            } else {
                                return context[part_expression];
                            }

                            // expression evaluates in global context
                        } else if (window && (part_expression in window)) {
                            if (typeof window[part_expression] === 'function' && executable) {
                                return window[part_expression].apply(context, args);
                            } else {
                                return window[part_expression];
                            }

                            // if not found in contexts above try to evaluate as JSON, then as object, array and string
                        } else {
                            try {
                                return JSON.parse(part_expression);
                            } catch (e) {

                                // string wrapped with '
                                if (/^'(.*?)'$/.test(part_expression)) {
                                    return JSON.parse(part_expression.replace(/^'(.*?)'$/, "\"$1\""));

                                    // string wrapped with {}
                                } else if (/^\{(.*?)\:(.*?)\}$/.test(part_expression.replace(/\n|\r/g, ""))) {
                                    var has_object_structure = true,
                                        object = {},
                                        parts;
                                    part_expression = part_expression.replace(/\n|\r/g, "").replace(/^\{(.*?)\}$/, "$1");
                                    parts = part_expression.splitOutside(",");
                                    for (var i in parts) {
                                        var part = parts[i];
                                        if (part.indexOf(":") === -1 || part.indexOf(":") === 0) {
                                            has_object_structure = false;
                                        } else {
                                            object[trim(part.split(":")[0])] = trim(part.split(":")[1]).parseExpression(context);
                                        }
                                    }
                                    if (has_object_structure) {
                                        return object;
                                    }

                                    // string wrapped in []
                                } else if (/^\[(.*?),(.*?)\]$/.test(part_expression.replace(/\n|\r/g, ""))) {
                                    part_expression = part_expression.replace(/\n|\r/g, "").replace(/^\[(.*?)\]$/, "$1");
                                    return part_expression.splitOutside(",", context);
                                }

                                // try whether can be converted to a string
                                try {
                                    return JSON.parse('"' + part_expression + '"');

                                    // unable to evaluate
                                } catch (err) {
                                    return undefined;
                                }
                            }
                        }
                    }, // end parser
                    condition,
                    expressionEvaluator = function(operator) {
                        var parts = expression.splitOutside(operator);
                        if (parts.length - 1) {
                            var a = parts[0].parseExpression(context),
                                b = parts[1].parseExpression(context);
                            switch (operator) {
                                case "<":
                                    condition = (a < b);
                                    break;
                                case ">":
                                    condition = (a > b);
                                    break;
                                case "<=":
                                    condition = (a <= b);
                                    break;
                                case ">=":
                                    condition = (a >= b);
                                    break;
                                case "===":
                                case "==":
                                    condition = (a === b);
                                    break;
                                case "!==":
                                case "!=":
                                    condition = (a !== b);
                                    break;
                                case "&&":
                                    condition = (a && b);
                                    break;
                                case "||":
                                    condition = (a || b);
                                    break;
                            }
                        }
                    };

                // look for expressions that evaluate as boolean
                var operators = "<=, <, >=, >, &&, ||, ===, ==, !==, !=".split(", ");
                for (var i in operators) {
                    expressionEvaluator(operators[i]);
                    if (typeof condition !== 'undefined') {
                        break;
                    }
                }
                if (condition !== undefined) {
                    return condition;
                }


                // parse string expressions of the type 'CBT.id.a(args)'
                // by using a progressively matching accumulator
                // evaluate <<context>>.CBT then <<global>>.CBT
                // if matches, then evaluate CBT.id, then CBT.id.a etc
                // if the expression is a function then parse arguments
                // and execute CBT.id.a(args)
                // if doesnt match, return string eg 'hello.world'
                var parts = expression.splitOutside(".");
                if (parts.length === 1) {
                    return _parser(trim(expression));
                } else {
                    var accumulator, executable, args;
                    if (typeof parts[0].parseExpression(context) === 'object') {
                        accumulator = parts[0].parseExpression(context);
                    } else {
                        return _parser(trim(expression));
                    }
                    parts.shift();
                    for (i in parts) {
                        var part_expression = parts[i];
                        if (i == parts.length - 1 && part_expression.indexOf("(") !== -1) {
                            executable = part_expression.substr(part_expression.lastIndexOf("("));
                            args = trim(executable.replace(/^\(|\)$/g, ""));
                            if (args) {
                                args = args.splitOutside(",", context);
                            } else {
                                args = [];
                            }
                            part_expression = trim(part_expression.substr(0, part_expression.indexOf("(")));
                        }
                        if (part_expression in accumulator) {
                            if (typeof accumulator[part_expression] === 'function' && executable) {
                                accumulator = accumulator[part_expression].apply(context, args);
                                break;
                            } else {
                                accumulator = accumulator[part_expression];
                            }
                        }
                    }
                    return accumulator;
                }
            };
        return parser.apply(context, [expression]);
    };

})();
