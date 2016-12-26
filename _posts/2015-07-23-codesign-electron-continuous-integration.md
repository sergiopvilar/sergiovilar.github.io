---
title:  Code signing Electron applications for OSX in Continuous Integration
date:   2015-07-23 19:00:00
description: A guide to setup a workflow to package and distribute Electron apps for OSX
layout: post
---

[Electron](https://github.com/atom/electron) is an awesome framework that lets you create cross-platform applications using web technologies (HTML, Javascript and CSS) and io.js. Is the same framework that Atom Editor was built.

This guide will help developers that uses Electron auto-update feature to get a Continuous Delivery/Integration workflow to package and distribute his apps.
<!--more-->
Let’s get started.

# Requirements

### Update server
To get the auto-update working you will need to setup an update server as described on [Electron documentation](https://github.com/atom/electron/blob/master/docs/api/auto-updater.md#server-support).

### OSX Developer Certificate
You will also need a certificate emitted by Apple because Squirrel needs the application to be code signed to update.

Access the [Developer Dashboard](https://developer.apple.com/account/mac/certificate/certificateCreate.action), select “Mac Development” and follow the instructions to download your certificate.

# Importing the certificates

At this step you’re supposed do have downloaded your certificate. Create a folder called `fixtures` in your project, move your `.cer` file to this folder and rename it to `mac_development.cer`.

Now you also need to export your identity from Keychain as a `.p12` file. Same process, move to the `fixtures` folder and rename it to `Certificates.p12`.

Crate a file at `./fixtures/certificate.sh` in your project with this content:

```bash
#!/bin/sh

FOLDER=$(pwd)
KEYCHAIN_PASSWORD=circleci
KEY_CHAIN=ios-build.keychain

security create-keychain -p circle $KEY_CHAIN
# Make the keychain the default so identities are found
security default-keychain -s $KEY_CHAIN
# Unlock the keychain
security unlock-keychain -p circle $KEY_CHAIN
# Set keychain locking timeout to 3600 seconds
security set-keychain-settings -t 3600 -u $KEY_CHAIN

# Add certificates to keychain and allow codesign to access them
security import $FOLDER/fixtures/mac_development.cer -k $KEY_CHAIN -T /usr/bin/codesign
security import $FOLDER/fixtures/Certificates.p12 -k $KEY_CHAIN -P $KEYCHAIN_PASSWORD -T /usr/bin/codesign

echo "Add keychain to keychain-list"
security list-keychains -s ios-build.keychain
```

Okay, our certificate import is ready, let’s setup the application packaging.

# Packaging the application

See [in this post](http://vilar.cc/2015/packaging-electron-applications/) how to setup the application packaging.

Then add this piece of code to the `pkg.js` script:

```javascript
if(plat === 'darwin'){
	cmds.push('./fixtures/certificate.sh');
	cmds.push('xcrun -log codesign --deep --force --sign "'+certificate_name+'" '+
	  '--keychain=ios-build.keychain' +
	  ' ./dist/'+appName+'.app '
	);
}
```

Remember to replace the content of `certificate_name` variable with your certificate name.

To package and code sign the app just run:

	node pkg.js --platform=darwin

Ready to go!

# Setup the Continuous Integration

[CircleCI](https://circleci.com) is a nice Continuous Integration service that has beta support to iOS builds, with a few ajdustments could be used to package our Electron application.

To use iOS builds on CircleCI you need to enable this option, [see here](https://circleci.com/docs/ios) for instructions. You can also contact the CircleCI support to get the iOS builds working.

CircleCI needs a `.xcodeproj` file but you don't really have to setup a Xcode Project, just [download here](http://d.pr/f/1jwxK) and extract to your `fixtures` folder.

Create a `circle.yml` in the root of your project root with this content:

```yaml
machine:
  environment:
    XCODE_SCHEME: ""
    XCODE_PROJECT: "fixtures/blablabla.xcodeproj"
  xcode:
    version: "6.3.1"

dependencies:
  pre:
    - brew install nodejs
    - npm install

test:
  override:
    - node pkg.js --platform=darwin
```

Now your app is packaged and code signed on CircleCI. You can do whatever you want, like upload to a S3 bucket or something like that.

If you have any questions, please let me know on the comments.
