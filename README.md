GhostWording Web Application
============================

prerequisites
-------------

#### node.js
[nodejs.org](http://nodejs.org)

#### bower
```npm install -g bower```

#### gulp
```npm install -g gulp```

installation
------------

```sh
git clone git@github.com:GhostWording/gw-web-app.git
cd gw-web-app
npm install
bower install
```

development build
-----------------

```sh
gulp build
gulp serve
```

automatic development rebuild
-----------------------------

```gulp serve``` and ```gulp watch```

local release build
-------------------

```sh
gulp release
gulp serve
```

deployment build
----------------

```gulp deploy```

testing
-------

```gulp test```

E2E testing
-----------

```gulp e2etest:run``` or ```gulp e2etest``` if already serving

linking with common
-------------------

Simultaneous development of gw-web-app and gw-common

```sh
cd ..
git clone git@github.com:GhostWording/gw-common.git
cd gw-common
bower link
cd ../gw-web-app
bower link gw-common
```

Then gw-common code can be edited/committed from either:

gw-common 
-or-
gw-web-app/bower_components/gw-common
