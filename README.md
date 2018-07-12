# Scarfold
Node CLI Utility for scaffolding source files from custom 
[Handlebars](http://handlebarsjs.com/ "Handlebars") templates

# Quickstart
1. Create folder **templates** and place custom template files there.
2. Create scarfold.json file (see examples) and put custom scaffolding commands in there.
3. Run generation **scarfold** &lt;template&gt; --var1 value1 --var2 value2

# Command reference
---
### scarfold &lt;template&gt; [...vars]
Generates rendered **template** with provided values in **vars**

---

### scarfold init
Creates basic **scarfold.json** and **templates** folder.

---

# Description
Each scaffolding command has "render" and "vars" properties.

render - defines how templates are projected to rendered files. In the example, template "textfile.txt" will be transformed to file "test/src/{{name}}.txt" (note paths can be also templated using standard Handlebars syntax).

vars - user defined parameters which can be supplied as command line arguments. These values will be rendered to template as user specifies.

Vars can also contain options **default**, if specified, the var will be considered optional and if not provided through CLI default value will be used.

# Example configuration
This configuration defines following:
* templateFolder - folder where users templates are stored (default: "templates")
* scaffolding - user defined commands which will be used to generate templates. 

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

# Todos
* case converter syntax (camel, pascal, snake ...)
* tests
* CI
* ???
* profit