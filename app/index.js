'use strict';
var util = require('util');
var path = require('path');
var spawn = require('child_process').spawn;
var yeoman = require('yeoman-generator');
var chalk = require('chalk');


var RocketGenerator = module.exports = function Rocketgenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  // setup the test-framework property, Gruntfile template will need this
  this.testFramework = options['test-framework'] || 'mocha';
  this.coffee = options.coffee;

  // for hooks to resolve on mocha by default
  options['test-framework'] = this.testFramework;

  // resolved to mocha by default (could be switched to jasmine for instance)
  this.hookFor('test-framework', {
    as: 'app',
    options: {
      options: {
        'skip-install': options['skip-install-message'],
        'skip-message': options['skip-install']
      }
    }
  });

  this.options = options;

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(RocketGenerator, yeoman.generators.Base);

RocketGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // welcome message
  if (!this.options['skip-welcome-message']) {
    console.log(this.yeoman);
    console.log(chalk.magenta('Out of the box I include HTML5 Boilerplate, jQuery, and a Gruntfile.js to build your app.'));
  }

  var prompts = [{
    type: 'checkbox',
    name: 'features',
    message: 'What more would you like?',
    choices: [{
      name: 'Sass with Compass',
      value: 'includeCompass',
      checked: true
    }, {
      name: 'Bootstrap',
      value: 'includeBootstrap',
      checked: true
    }, {
      name: 'Modernizr',
      value: 'includeModernizr',
      checked: true
    }]
  }];

  this.prompt(prompts, function(answers) {
    var features = answers.features;

    function hasFeature(feat) { return features.indexOf(feat) !== -1; }

    // manually deal with the response, get back and store the results.
    // we change a bit this way of doing to automatically do this in the self.prompt() method.
    this.includeCompass = hasFeature('includeCompass');
    this.includeBootstrap = hasFeature('includeBootstrap');
    this.includeModernizr = hasFeature('includeModernizr');

    cb();
  }.bind(this));
};

RocketGenerator.prototype.gruntfile = function gruntfile() {
  this.template('Gruntfile.js');
};

RocketGenerator.prototype.packageJSON = function packageJSON() {
  this.template('_package.json', 'package.json');
};

RocketGenerator.prototype.git = function git() {
  this.copy('gitignore', '.gitignore');
  this.copy('gitattributes', '.gitattributes');
};

RocketGenerator.prototype.bower = function bower() {
  this.copy('bowerrc', '.bowerrc');
  this.copy('_bower.json', 'bower.json');
};

RocketGenerator.prototype.jshint = function jshint() {
  this.copy('jshintrc', '.jshintrc');
};

RocketGenerator.prototype.editorConfig = function editorConfig() {
  this.copy('editorconfig', '.editorconfig');
};

RocketGenerator.prototype.h5bp = function h5bp() {
  this.copy('favicon.ico', 'frontend/favicon.ico');
  this.copy('404.html', 'frontend/404.html');
  this.copy('robots.txt', 'frontend/robots.txt');
  this.copy('htaccess', 'frontend/.htaccess');
};

RocketGenerator.prototype.mainStylesheet = function mainStylesheet() {
  var css = 'main.' + (this.includeCompass ? 's' : '') + 'css';
  this.copy(css, 'frontend/styles/' + css);
};

RocketGenerator.prototype.writeIndex = function writeIndex() {

  this.indexFile = this.readFileAsString(path.join(this.sourceRoot(), 'index.html'));
  this.indexFile = this.engine(this.indexFile, this);

  // wire Twitter Bootstrap plugins
  if (this.includeBootstrap) {
    var bs = 'bower_components/bootstrap' + (this.includeCompass ? '-sass-official/vendor/assets/javascripts/bootstrap/' : '/js/');
    this.indexFile = this.appendScripts(this.indexFile, 'scripts/plugins.js', [
      bs + 'affix.js',
      bs + 'alert.js',
      bs + 'dropdown.js',
      bs + 'tooltip.js',
      bs + 'modal.js',
      bs + 'transition.js',
      bs + 'button.js',
      bs + 'popover.js',
      bs + 'carousel.js',
      bs + 'scrollspy.js',
      bs + 'collapse.js',
      bs + 'tab.js'
    ]);
  }

  this.indexFile = this.appendFiles({
    html: this.indexFile,
    fileType: 'js',
    optimizedPath: 'scripts/main.js',
    sourceFileList: ['scripts/main.js'],
    searchPath: '{frontend,.tmp}'
  });
};

RocketGenerator.prototype.app = function app() {
  this.mkdir('frontend');
  this.mkdir('frontend/scripts');
  this.mkdir('frontend/styles');
  this.mkdir('frontend/images');
  this.write('frontend/index.html', this.indexFile);

  if (this.coffee) {
    this.write(
      'frontend/scripts/main.coffee',
      'console.log "\'Allo from CoffeeScript!"'
    );
  } else {
    this.write('frontend/scripts/main.js', 'console.log(\'\\\'Allo \\\'Allo!\');');
  }
};

RocketGenerator.prototype.install = function () {
  if (this.options['skip-install']) {
    return;
  }

  var done = this.async();
  this.installDependencies({
    skipMessage: this.options['skip-install-message'],
    skipInstall: this.options['skip-install'],
    callback: done
  });
};
