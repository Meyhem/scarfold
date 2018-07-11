# scarfold
Node CLI Utility for scaffolding source files from custom templates

# generation
**scarfold** &lt;template&gt; --var1 value1 --var2 value2

# example confgiuration
This configuration defines following:
* templateFolder - folder where users templates are stored (default: "templates")
* graceful - to be implemented (if false, execution will follow fail-fast strategy)
* scaffolding - user defined commands which will be used to generate templates. 

In example config "textfile" command is defined. user invokes this scaffolding command by **scarfold textfile --name SomeName --status SomeStatus**
Each scaffolding command has "render" and "vars" properties.

render - defines how templates are projected to rendered files. In the example, template "textfile.txt" will be transformed to file "test/src/##name##.txt" (note paths can be also templated using standard ## syntax).

vars - user defined parameters which can be supplied as command line arguments. These values will be rendered to template where they are used. e.g. user specifies CLI parameter **--name Hello**, render engine will look for **##NAME##** (case insensitive) and replace all occurences with "**Hello**".

Vars can also contain options **default**, if specified, the var will be considered optional and if not provided trough CLI default value will be used.

```json
{
  "templateFolder": "templates",
  "graceful": false,
  "scaffolding": {
    "textfile": {
      "render": {
        "textfile.txt": "test/src/##name##.txt",
        "textfile2.txt": "test/src/##name##.txt"
      },
      "vars": {
        "name": {},
        "status": {
          "default": "simple"
        }
      }
    }
  }
}
```