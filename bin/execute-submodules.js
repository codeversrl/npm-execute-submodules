#!/usr/bin/env node
const { spawn, spawnSync } = require('child_process');
const [,, ...args] = process.argv;
const command = require('meow')
const glob = require('glob');
const path = require('path');
const appRoot = require('app-root-path');
const fs = require('fs');

const cli = command(`
  Usage
    $ execute-submodules <command>
  
  Options
    --verbose, -v enable verbose mode
    --dir [directory], -d limit the execution to the given directory
    --ignore [directory], glob regexp to ignore
`, {
	flags: {
		verbose: {
			type: 'boolean',
			alias: 'v'
    },
    dir: {
			type: 'string',
			alias: 'v'
		}
  },
  input:{
    command: {
      type: 'string'
    }   
	}
})


if (cli.input.length === 0) {
  console.error('Missing command')
  cli.showHelp(1)
}

let options = {};
let processedArgs = processArgs(cli);
let glob_path = path.join(appRoot.path, processedArgs.dir, "**/package.json");
options.cwd = process.cwd();
options.root = path.resolve(options.cwd, "/");
options.ignore = processedArgs.ignore;
glob(glob_path, options, function (err, files) {
  console.log('[npm execute submodules] Starting execution for command:', processedArgs.commandLine);
  files.map((file)=>{
    let opts = {};
    try {      
      let packageJson = JSON.parse(fs.readFileSync(file, 'utf8'));
      let scripts = packageJson.scripts;
      if(!scripts || !scripts.hasOwnProperty(processedArgs.script)){
        return null;
      }
      let path = file.replace('/package.json', '');
      path = path.replace('package.json', '');
      if(!path || path.length==0){
        path = ".";
      }      
      opts.cwd = path;
      opts.stdio = 'inherit';
      opts.encoding = 'utf-8';
      if(processedArgs.verbose){
        console.log('[npm execute submodules] Executing "%s" in %s', processedArgs.commandLine, path);
      }
      let res = spawnSync(processedArgs.command, processedArgs.args, opts);
      if(res.error && res.error.toString().length>0){
        console.log('[npm execute submodules] ERROR:', res.error.toString());
      } else {
        if(processedArgs.verbose){
          console.log('[npm execute submodules] Executed "%s" in %s with success.', processedArgs.commandLine, path);
        }
      }
    } catch(e) {
      console.error('[npm execute submodules] Error on executing "%s" in %j: %s', processedArgs.commandLine, opts.cwd || path, e);
      process.exit(1);
    }
  });
  process.exit(0);
});

process.on('exit', function(code) {
  console.log('[npm execute submodules] end of execution.');
});

function processArgs(cliArgs){
  let script = cliArgs.input[0];
  var result = {
    command: 'npm',
    commandLine: 'npm run '+script,
    verbose: false,
    args: ['run', script],
    script: script,
    dir: 'node_modules',
    ignore: null
  };
  if(cliArgs.flags){
    if(cliArgs.flags.hasOwnProperty('verbose') || cliArgs.flags.hasOwnProperty('v')){
      result.verbose=cliArgs.flags.verbose || cliArgs.flags.v;
    }
    if(cliArgs.flags.hasOwnProperty('dir')){
      result.dir=cliArgs.flags.dir;
    }
    if(cliArgs.flags.hasOwnProperty('ignore')){
      result.ignore=cliArgs.flags.ignore;
    }
  }
  return result;
}
