#!/usr/bin/env node
const { spawn, spawnSync } = require('child_process');
const [,, ...args] = process.argv;
const command = require('meow')
const glob = require('glob');
const path = require('path');


const cli = command(`
  Usage
    $ execute-submodules <command>
`)


if (cli.input.length === 0) {
  console.error('Missing: command.')
  cli.showHelp(1)
}

let options = {};
options.cwd = process.cwd();
options.root = path.resolve(options.cwd, "/");

glob("**/package.json", options, function (er, files) {
  let commandLine = args.join(' ');
  files.map((file)=>{
    try {
      let path = file.replace('package.json', '');
        if(!path || path.length==0){
            path = ".";
        }
        let opts = {};
        opts.cwd = path;
        let res = spawnSync(args[0], args.slice(1), opts);
        if(res.sterr && res.sterr.toString().length>0){
          console.log('Executing "%s" in "%s"...', commandLine, path);
          console.log('ERROR:', res.stderr.toString());
        } else if(res.stdout && res.stout.toString().length>0){
          console.log('Executing "%s" in "%s"...', commandLine, path);
          console.log('RESULT:', res.stdout.toString());
        }
    } catch(e) {
      console.error('Error on executing "%s" in "%s": %s', commandLine, path, e);
      process.exit(1);
    }
  });
  process.exit(0);
})

process.on('exit', function() {
  console.log('END');
});
