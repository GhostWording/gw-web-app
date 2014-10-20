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

```sh
gulp serve
```

and

```sh
gulp watch
```

local release build
-------------------

```sh
gulp release
gulp serve
```

deployment build
----------------

```sh
gulp deploy
```

testing
-------

```sh
gulp test
```

E2E testing
-----------

```sh
gulp e2etest:run
```

or

```sh
gulp e2etest
```

(if already serving)

linking with common
-------------------

Allowing simultaneous development of gw-web-app and gw-common

```sh
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
