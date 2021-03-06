GhostWording Web Application
============================

Prerequisites
-------------

#### node.js
[nodejs.org](http://nodejs.org)

#### bower
```npm install -g bower```

#### gulp
```npm install -g gulp```

Installation
------------

```sh
git clone git@github.com:GhostWording/gw-web-app.git
cd gw-web-app
npm install
bower install
```

Building
-----------------

**development**
```gulp build``` then ```gulp serve```

**development watch**
```gulp serve``` and ```gulp watch```

**local release** 
```gulp release``` then ```gulp serve```

**deployment** 
```gulp deploy```

Testing
-------

**unit** 
```gulp test```

**e2e** 
```gulp e2etest:run``` or ```gulp e2etest``` (if already serving)

Linking With Common
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

After which gw-common code can be edited/committed from both:

gw-common 

**and**

gw-web-app/bower_components/gw-common
