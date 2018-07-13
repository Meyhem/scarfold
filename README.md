# Scarfold
Node CLI Utility for scaffolding source files from custom 
[Handlebars](http://handlebarsjs.com/ "Handlebars") templates

# Installation
$ npm install -g scarfold

or

$ yarn global add scarfold


# Quickstart
1. scarfold init
2. add custom scaffolding commands to scarfold.json
3. Run generation **scarfold** &lt;template&gt; --var1 value1 --var2 value2

# Command reference
---
### scarfold &lt;template&gt; [...options] [...vars]
Generates rendered **template** with provided values in **vars**

**--override** - Disable checking whether destination file already exists. Beware of accidental data loss.

---

### scarfold init
Creates basic **scarfold.json** and **templates** folder.

---

# Template syntax
The templates use standard Handlebars.js syntax which can be found [here](https://handlebarsjs.com/expressions.html). Also check out examples.

```
{{ variable }}                      // render a value
{{{ variable }}}                    // render unescaped
{{#if variable }}...{{/if}}         // condition
{{#unless variable }}...{{/unless}} // negated condition
```


# Description
Each scaffolding command has "render" and "vars" properties.

render - defines how templates are projected to rendered files. In the example, template "textfile.txt" will be transformed to file "test/src/{{name}}.txt" (note paths can be also templated using standard Handlebars syntax).

vars - user defined parameters which can be supplied as command line arguments. These values will be passed to template engine.

Vars can also contain options **default**, if specified, the var will be considered optional and if not provided through CLI default value will be used.

# Example configuration
This configuration defines following:
* templateFolder - folder where users templates are stored (default: "templates")
* scaffolding - user defined commands which will be used to generate templates. 
* scaffolding.textfile - scaffolding command

In example config "textfile" command is defined. user invokes this scaffolding command by **scarfold textfile --name SomeName --status SomeStatus**
```json
{
  "templateFolder": "templates",
  "scaffolding": {
    "textfile": {
      "render": [
        {
          "template": "textfile.txt",
          "dest": "test/src/{{name}}.txt"
        },
        {
          "template": "textfile2.txt",
          "dest": "test/src/{{name}}2.txt"
        }
      ],
      "vars": {
        "name": { },
        "status": {
          "default": "simple"
        }
      }
    }
  }
}
```

# Development
Compilation - **yarn build**

Dev compilation watcher - **yarn dev**

Run tests - **yarn test**

# Todos
* case converter syntax (camel, pascal, snake ...)
* CI
* var type coercion
* ???
* profit
