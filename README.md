# NPM Execute Submodules

[![npm (scoped)](https://img.shields.io/npm/v/@codever/npm-execute-submodules.svg?style=plastic)](https://www.npmjs.com/package/@codever/npm-execute-submodules)

Executes an npm script through all the NPM modules in `node_modules` folder.

## How does it work

The provided script will be executed for every `package.json` file that has that script implemented inside `node_modules` folder.
It is supposed to fit well with complex projects having custom submodules as dependencies.
If those submodules have an updated version with new migrations or new tests, you can make it all run with a single command.

### Why I should need it

Every `package.json` file can have a `scripts` section like

```
  "scripts": {
    "test": "jest mytest --notify"
  },
```

if you need to execute `npm run test` on all (or part) of our submodules, you could use `execute-submodules test`


### Why not using npm explore?

`npm explore` is a very great tool, but it only calls one module at a time.
If you need to execute the same command on all your submodules, you should call `npm explore` for each one of them.

## Installation

```
npm install @codever/execute-submodules --save-dev
```


## Usage

```
execute-submodules [command] [--dir [directory]] [--ignore [regexp]] [--verbose]
```

where

 * `--dir` sets a specific subdirectory where the packages. Default value is `node_modules`, but using local modules could need a different directory
 * `--ignore` sets a regular expression pattern to exclude matches
 * `--verbose` output every module where the npm script is executed

### Usage with npm

```
npx execute-submodules [command]
```


#### Examples

Run all the migration (`npm run migrate`) throught all the submodules

```
execute-submodules migrate
```

or

```
npx execute-submodules migrate
```
