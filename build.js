'use strict'
var exec = require('child_process').exec,
    pack = require('./package');

var COMMAND_PREFIX = 'rm -fr pkg; mkdir pkg; zip -r';

var target = pack.name,
    main = pack.main,
    npm_dir = 'node_modules',
    excludes_str = '';

Object.keys(pack.devDependencies || {}).forEach(function(key){
  excludes_str = excludes_str + build_exclude_str(key);
});

exec(build_command_str(target,main,excludes_str),function(err,stdout,stderr){
  if(err) console.log(err);
  console.log(stdout);
  console.log(stderr);
});

function build_exclude_str (key){
  return npm_dir + '/' + key + '\\* ';
}

function build_command_str(target,main,excludes_str){
  return COMMAND_PREFIX
         + ' pkg/' +
         target
         + '.zip ' +
         main
         + ' ' +
         npm_dir
         + (excludes_str ? ' -x ' + excludes_str : '');
}