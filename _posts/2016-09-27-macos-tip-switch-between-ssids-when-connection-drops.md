---
title: "macOS tip: Switch between SSIDs when connection drops"
date:   2016-09-27 19:00:00
tags: [macos,applescript,tip]
category: macos
layout: post
---

When I started working from home one of my bigger concerns was about connection issues. As you may know, internet connection in Brazil is not trustable so I tought in a redundancy for my internet connection.

The thing is, I would like to switch to my redundancy internet signal when the main drops out and a simple applescript promised me to solve the problem.

<!--more-->

## Dependencies

For this tip you'll need just one dependency:

    npm install -g osx-wifi-cli

I'm assuming that you already have node.js installed on your mac, ok?

## The applescript

The applescript is pretty simple, it's just a routine that checks the connection pinging to 8.8.8.8 and if the connection drops, switch to other SSID.

{% highlight shell %}
set CLI to "/usr/local/bin/node /usr/local/bin/osx-wifi-cli "

on connectTo(network, CLI)
    do shell script (CLI & " " & network & " <YOUR_PASSWORD>")
    display notification "Changing to " & network
end connectTo

on checkForConnection(CLI)

    set IP_address to "8.8.8.8"
    set MAIN_SSID to "My_main_SSID"
    set REDUNDANCY_SSID to "My_second_SSID"
    log "Checking for connection"

    try
        do shell script ("ping -c 2 " & IP_address)
    on error
        log "Internet is down"
        set SSID to do shell script (CLI & " | awk '{ print $NF }' | xargs")

        if SSID = MAIN_SSID then connectTo(REDUNDANCY_SSID, CLI)
        if SSID = REDUNDANCY_SSID then connectTo(MAIN_SSID, CLI)
        
    end try
    
    log "Finishing..."
    delay 1
    checkForConnection(CLI)

end checkForConnection

checkForConnection(CLI)
{% endhighlight %}

Job done!



