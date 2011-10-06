# To run this makefile, you must do the following.
#
# 1.)  Download http://closure-compiler.googlecode.com/files/compiler-latest.zip
#      and place compiler.jar within the tools directory.
#
# 2.)  Install closure-linter tool at by following
#      http://code.google.com/closure/utilities/docs/linter_howto.html

# Create the list of files
files =   js/source/drupal.media.compatibility.js\
          js/source/drupal.media.flags.js\
          js/source/drupal.media.plugin.js\
          js/source/drupal.media.display.js\
          js/source/drupal.media.player.js\
          js/source/drupal.media.file.js\
          js/source/drupal.media.playLoader.base.js\
          js/source/drupal.media.players.base.js\
          js/source/drupal.media.players.html5.js\
          js/source/drupal.media.players.flash.js\
          js/source/drupal.media.controllers.base.js\
          js/source/drupal.media.templates.base.js

.DEFAULT_GOAL := all

all: jslint js

# Perform a jsLint on all the files.
jslint: ${files}
	gjslint $^

# Create an aggregated js file and a compressed js file.
js: ${files}
	@echo "Generating aggregated js/drupal.media.player.js file"
	@cat > js/drupal.media.player.js $^
	@echo "Generating compressed js/drupal.media.player.compressed file"
	@java -jar tools/compiler.jar --js js/drupal.media.player.js --js_output_file js/drupal.media.player.compressed.js

# Fix the js style on all the files.
fixjsstyle: ${files}
	fixjsstyle $^
