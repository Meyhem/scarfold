# Scarfold
Node CLI Utility for scaffolding source files from custom templates

# Quickstart
1. Create folder **templates** and place custom template files there.
2. Create scarfold.json file (see examples) and put custom scaffolding commands in there.
3. Run generation **scarfold** &lt;template&gt; --var1 value1 --var2 value2



# How to use
Each scaffolding command has "render" and "vars" properties.

render - defines how templates are projected to rendered files. In the example, template "textfile.txt" will be transformed to file "test/src/##name##.txt" (note paths can be also templated using standard ## syntax).

vars - user defined parameters which can be supplied as command line arguments. These values will be rendered to template where they are used. e.g. user specifies CLI parameter **--name Hello**, render engine will look for **##NAME##** (case insensitive) and replace all occurences with "**Hello**".

Vars can also contain options **default**, if specified, the var will be considered optional and if not provided through CLI default value will be used.

# Example configuration
This configuration defines following:
* templateFolder - folder where users templates are stored (default: "templates")
* scaffolding - user defined commands which will be used to generate templates. 

In example config "textfile" command is defined. user invokes this scaffolding command by **scarfold textfile --name SomeName --status SomeStatus**
```json
{
  "templateFolder": "templates",
  "graceful": false,
  "scaffolding": {
    "textfile": {
      "render": [
        {
          "template": "textfile.txt",
          "dest": "test/src/##name##.txt"
        },
        {
          "template": "textfile2.txt",
          "dest": "test/src/##name##2.txt"
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
* ???
* profit