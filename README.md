# Execute NPM Submodules

[![npm (scoped)](https://img.shields.io/npm/v/@codever/npm-execute-submodules.svg?style=plastic)](https://www.npmjs.com/package/@codever/npm-execute-submodules)

Executes a command through all the NPM modules in `node_modules` folder.

## How does it work

The provided command will be executed for every submodule inside `node_modules` folder.
It is supposed to fit well with complex projects having custom submodules as dependencies.
If those submodules have an updated version with new migrations or new tests, you can make it all run with a single command.

### Why not using npm explore?

`npm explore` is a very great tool, but

## Installation

```
npm install @codever/execute-submodules --save-dev
```


## Usage

```
execute-submodules [command]
```

### Usage with npm

```
npx execute-submodules [command]
```


#### Examples

Run all the migration throught all the submodules

```
execute-submodules migrate
```

or

```
npx execute-submodules migrate
```
