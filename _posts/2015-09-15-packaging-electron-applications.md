---
title: Packaging an Electron application for OSX, Windows and Linux
date:   2015-09-15 19:00:00
description: Simple script that allows customization for specific platform/architeture
keywords: electron,javascript,nodejs
category: electron
---

To package your Electron application we’ll use a nodejs script that could be customized for codesign and/or CI purposes.

First we need to install the dependencies:

	npm install —save-dev electron-packager shelljs

Create a file named `pkg.js` in your project’s root:

<script src="https://gist.github.com/sergiovilar/5e69015c17c884a75567.js"></script>


### Usage

To package only for osx, run:

	node pkg.js —platform=darwin

To pagkage for all platforms:

	node pkg.js —all

To package only for the current platform:

	node pkg.js


### Customization

This script allows you customize the build for specific platform/architeture. For instance, you can push a codesign command to `cmds` if the platform is `darwin`:

```javascript
if(plat === 'darwin'){
  cmds.push('codesign command');
}
```

See all [Electron series](http://vilar.cc/category/electron).
