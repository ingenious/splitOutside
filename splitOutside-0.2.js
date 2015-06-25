// version 0.2
// splitOutside and parseExpression String methods
// Stephen Giles

(function() {

    var root = this,
     trim = function(string) {
                        return string.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
                    },
        SO = {
            splitOutside: function(delimiting_string, context, placeholder) {
                var splitter, parts, string,
                    temp_placeholder = "===-===",
                    self = {
                        splitOutside: this.splitOutside,
                        parseExpression: this.parseExpression
                    };
                if ((typeof arguments[0] === 'string' && typeof arguments[1] === 'string') ||
                    (this.constructor !== String && typeof arguments[0] === 'string')
                ) {
                    string = arguments[0];
                    delimiting_string = arguments[1];
                    context = arguments[2];
                    placeholder = arguments[3];
                } else if (this.constructor !== String) {
                    if (typeof arguments[0] !== 'string' && arguments[0].constructor !== String) {
                        throw new Error('Must specify String to be parsed');
                    }
                } else {
                    string = this.toString();
                }
                if (!delimiting_string || typeof delimiting_string !== 'string') {
                    return [string];
                }
                if (!placeholder || typeof placeholder !== 'string') {
                    placeholder = delimiting_string !== '-' ? "==---==" : "==~~~==";
                }
                if (context === undefined && !self.parseExpression) {
                    throw new Error('splitOutside depnds on parseExpression');
                }
                if (context !== undefined && !self.parseExpression) {
                    throw new Error('splitOutside depnds on parseExpression');
                }
                splitter = "\\" + delimiting_string.split("").join("\\");
                temp_placeholder = delimiting_string !== '-' ? "===-===" : "===~===";
                placeholder = placeholder.replace(delimiting_string, '~');

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
                .replace(new RegExp(splitter + "(?=[^()]*?\\))", "g"), placeholder);

                // split using delimiting_string
                parts = parts.split(delimiting_string);

                // replace placeholders in quotes and brackets with delimiting_string 
                for (var i in parts) {
                    var parsed=parts[i];
                    parts[i] = parts[i].replace(new RegExp(placeholder, "g"), delimiting_string);
                    if (typeof context !== 'undefined') {
                        parts[i] = self.parseExpression(parts[i], context);
                    }
                }
                return parts;
            },

            parseExpression: function(context) {
                var expression, parser,
                    self = {
                        splitOutside: this.splitOutside,
                        parseExpression: this.parseExpression
                    };
                if (!self.splitOutside) {
                    throw new Error('parseExpression depends on splitOutside');
                }
                if (this.constructor !== String && typeof arguments[0] === 'string') {
                    expression = arguments[0];
                    context = arguments[1];
                } else if (this.constructor !== String) {
                    throw new Error('Must specify string to be parsed');
                } else {
                    expression = this.toString();
                }
                parser = function(expression) {

                    var condition,
                        operators = "<=, <, >=, >, &&, ||, ===, ==, !==, !=, -, +, %, *, /".split(", "),
                        _parser = function(part_expression) {
                               
                            var executable, args = [];
                            part_expression = trim(part_expression);

                            // if the expression has '(..)' treat as executable 
                            if (/\)$/.test(part_expression) && part_expression.indexOf("(") !== -1) {
                                executable = part_expression.substr(part_expression.indexOf("("));
                               part_expression = part_expression.substr(0, part_expression.indexOf("("));
                                 args = trim(executable.replace(/[()]/g, ""));

                                if (args) {
                                    args = self.splitOutside(args, ",", context);
                                } else {
                                    args=[];
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
                            } else if (root && (part_expression in root)) {
                                if (typeof root[part_expression] === 'function' && executable) {
                                    return root[part_expression].apply(context, args);
                                } else {
                                    return root[part_expression];
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
                                        parts = self.splitOutside(part_expression, ",");
                                        for (var i in parts) {
                                            var value, part = parts[i], sub_part=self.splitOutside(part,":", context);
                                            if (sub_part.length!==2 || typeof sub_part[0]!=='string') {
                                                has_object_structure = false;
                                            } else {
                                                object[sub_part[0]]=sub_part[1];
                                            }
                                        }
                                        if (has_object_structure) {
                                            return object;
                                        }

                                        // string wrapped in []
                                    } else if (/^\[(.*?),(.*?)\]$/.test(part_expression.replace(/\n|\r/g, ""))) {
                                        part_expression = part_expression.replace(/\n|\r/g, "").replace(/^\[(.*?)\]$/, "$1");
                                        return self.splitOutside(part_expression, ",", context);
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
                        }, // end _parser

                        expressionEvaluator = function(operator, expression) {
                            var condition, parts, sub_expression = trim(expression);

                            // remove any brackets () in expression
                            if (/^\([^()]+\)$/.test(sub_expression)) {
                                sub_expression = sub_expression.substr(1, sub_expression.length - 2);
                            }
                            parts = self.splitOutside(sub_expression, operator);
                            if (parts.length - 1) {
                                var a = self.parseExpression(parts.shift(), context),
                                    b = self.parseExpression(parts.join(operator), context);
                                if ((typeof a !== 'boolean'  && typeof a !== 'number') ||
                                    (typeof b !== 'boolean' && typeof b !== 'number')
                                ) return;
                                switch (operator) {
                                    case "/":
                                        condition = (a / b);
                                        break;
                                    case "*":
                                        condition = (a * b);
                                        break;
                                    case "%":
                                        condition = (a % b);
                                        break;
                                    case "+":
                                        condition = (a + b);
                                        break;
                                    case "-":
                                        condition = (a - b);
                                        break;
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
                            return condition;
                        };

                    // look for expressions that evaluate as boolean or number
                    for (var i in operators) {
                        if (expression.indexOf(operators[i]) !== -1) {
                            condition = expressionEvaluator(operators[i], expression);
                            if (typeof condition !== 'undefined') {
                                break;
                            }
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
                    var parts = self.splitOutside(expression, ".");
                    if (parts.length === 1) {

                        return _parser(trim(expression));
                    } else {
                        var accumulator, executable, args;
                        if (typeof self.parseExpression(parts[0], context) === 'object') {
                            accumulator = self.parseExpression(parts[0], context);
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
                                    args = self.splitOutside(args, ",", context);
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
            }
        };

    // AMD module: return object with 2 x methods
    if (this.define && this.define.amd && "function" === typeof this.define) {
        define([], function() {
            return SO;
        });
        // CommonJS: return object with 2 x methods
    } else if (undefined !== exports && undefined !== module && module.exports) {
        exports = module.exports = SO;
    } else {

        // Run in Global:  Extend String object
        String.prototype.splitOutside = SO.splitOutside;
        String.prototype.parseExpression = SO.parseExpression;
    }






})();
