Privacy Parrot Sample Extension
===============================

This sample extension uses a few APIs in order to demonstrate how a complete
project might work.

http://privacyparrot.com/ is a great websites that gives a simple answer to the
question "Does this website sell any personal information I might give it?"
http://privacyparrot.com/privacy-policy-for-google.com is one such answer.

This sample extension uses the [`tabs` API][tab] in order to detect what page
you're currently viewing, and pings Privacy Parrot to figure out whether that
page sells your personal information. The result is cached for two weeks using
the [`storage` API][storage]. We also had to request host permissions to scrape
data from the Privacy Parrot site via [cross-origin `XMLHttpRequest`][xhr].

Note that a side-effect of this extension is that Privacy Parrot has a complete
record of the hosts you've visited. A better version of this extension might
only make the Privacy Parrot request when the user explicitly asks for
information.

[tab]: http://developer.chrome.com/trunk/extensions/tabs.html
[storage]: http://developer.chrome.com/trunk/extensions/storage.html
[xhr]: http://developer.chrome.com/trunk/extensions/xhr.html

License
-------

The license for this extension (BSD 3-clause) can be found in the
[LICENSE.markdown][license] file.

[license]: https://github.com/mikewest/ExtensionHackathonBoilerplate/blob/master/LICENSE.markdown

Authors
-------

* Mike West: https://mikewest.org/
