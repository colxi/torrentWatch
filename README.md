# torrentWatch (Development)
Torrent Release Watcher (Google Chrome Extension)


##DEVELOPMENT INSTALL INSTRUCTIONS:

- Install NodeJS :
https://nodejs.org/en/download/

- Install Ruby :  
http://www.ruby-lang.org/en/documentation/installation/

- Install Sass : 
>gem install sass

- Install Compass :
>gem install compass

- Download dependencies. (execute following command in torrentWatch root directory:
>npm install


##TROUBLESHOTING


¿ GRUNT-OUTPUT install FAILS ? :
Manual Patch Required! Details in following link:
https://github.com/lucaslopez/grunt-output/commit/6b66c0db5826ec04646709a6957d4eab96e2b414
Until developer publishes the upgrade on npm, follow this steps  :

1- 	In <repositoy_root>/node_modules/grunt-output/package.json - line 38 (peerDependencies)
	"grunt": "~0.4.5"
	--must be replaced with--
	"grunt": ">=0.4.0"
2- 	After save, execute in console (with prompt in <repositoy_root>/node_modules/grunt-output/)
	npm cache clear
	npm install
	...to allow plugin dependencies being completely installed
3-	Return to repository root folder, and execute:
	npm cache clear
	npm install
	...to acomplish a complete package installation
	DONE! Fancy messages on Grunt are back!


