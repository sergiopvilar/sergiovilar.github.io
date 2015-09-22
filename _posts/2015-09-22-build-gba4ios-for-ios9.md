---
title: Build yourself a copy of GBA4iOS for iOS 9
date:   2015-09-22 19:00:00
description: Guide that shows how to build and run GBA4iOS in your phone
keywords: ios,gba,gbc,xcode
category: guide
---

GBA4iOS is an awesome GBA and GBC emulator for iOS and for obvious reasons can’t be on AppStore. The current version only supports iOS 8.3. If are you using iOS 9 and want to give a try, follow this guide.

The new version of Xcode allows that you can test an app in your device without having to be a member of the Apple Developer Program.

1 - [Download and install the Xcode 7 beta](https://developer.apple.com/xcode/downloads/)

2 - Open Xcode 7, open preferences and login to your Apple Account.

![Account](/assets/images/posts/gba4ios_account.png)

3 - Download the source of the updated version of GBA4iOS:

```
git clone git@bitbucket.org:raullunab12/gba4ios-raul-fork.git -b updated_ios9 gba; cd gba
```

4 - Edit the file named `Podfile` and replace this line:

```
pod "Crashlytics"
```

By this:

```
pod "Crashlytics", "3.1.1"
```

5 - Install the project dependencies:

```
sudo gem install cocoapods
pod install
```

6 - Open the workspace in Xcode, plug in your iPhone and select it as the build destination.

![Destination](/assets/images/posts/gba4ios_play.png)

7 - We now need to generate a code signing signature for the app. Click on the project on the left, fill in a unique “Bundle Identifier” and click on “Fix Issue” (make sure your name is selected as “team”)

![Codesign](/assets/images/posts/gba4ios_codesign.png)

8 - Click the play button in the top left. If there’s no build errors the app should now launch on your phone!

Ready to go!

This guide is based on [this post](http://bouk.co/blog/sideload-iphone/) with the proper changes to work in iOS 9.
