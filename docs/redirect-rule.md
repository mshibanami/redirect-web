# Redirect Rule

This section provides detailed information on how to set up redirect rules using Redirect Web.

## Options

### Redirect From

The Redirect From option allows you to specify the URL pattern of the website you want to redirect from. You can choose a URL pattern type from Regular Expression and Wildcard to specify the URL pattern.

For example, if you specify `https://example.com/*` with wildcard, then, for example, `https://example.com/` and `https://example.com/hello` are matched.

The matched URLs can be referenced in the Redirect To option, using `$0`, `$1` ... which is called back-referencing. Check the details in [URL Pattern](#url-pattern) in this page.

### Redirect To

The Redirect To option specifies the URL you want to redirect to from the URL matched with the Redirect From option. You can use the back-referencing using `$0`, `$1`, ... to dynamically generate the URL. Check the details in [URL Pattern](#url-pattern) in this page.

For example, if you set `https://example.com/$1` in the Redirect To option, and the URL matched with the Redirect From option is `https://example.com/hello`, then the generated URL will be `https://example.com/hello`.

You can also specify a custom URL scheme to open an app, such as `mailto:` to open the default email client. To specify an app, use the format `app:<bundle identifier>/<URL>`. For example, to open the Notion app with a specific page, use `app:notion://openPage?pageId=<page ID>`.

If you want to specify an app you want to open the destination URL with (macOS only), specify it in the Application combo box. Please note that you can only open an app that supports [App Sandbox](https://developer.apple.com/documentation/security/app_sandbox). Also, make sure that the app supports opening the URL you want to open.

You can also specify the Capture Group Processing option to process the text captured by the pattern in the Redirect To option. Please see the details in the following [Capture Group Processing](#capture-group-processing) section.

### Capture Group Processing

The Capture Group Processing option allows you to specify how to process the text captured by the pattern in the Redirect To option. You can choose one or more of the following processes:

- URL Encode/Decode
- Base64 Encode/Decode
- Replace Occurrences

### Excluded URL Patterns

The Excluded URL Patterns option allows you to specify the URLs that are not redirected. This can be useful to avoid redirect loops, or to exclude certain parts of a website from being redirected.

You can specify excluded URL patterns using either Regular Expression or Wildcard pattern types.

Please note that if there are conflicts between the excluded URL patterns and the redirect rules, the excluded URL pattern takes priority and the URL will not be redirected.

### Examples

The Examples option allows you to test your redirect rule by providing sample URLs. By adding a sample URL, you can check whether the rule works as expected before actually applying it.

### Comments

The Comments section allows you to add any notes or comments about your redirect rule. This can be useful for keeping track of why you created a specific rule, or for providing context for others who might view your rules.

## URL Pattern

There are 3 options you can specify one or more URL patterns:

- Redirect From: To specify the target URLs
- Excluded URL Patterns: To specify the URLs that aren't redirected
- Capture Group Processing: To specify the target string appearing in a captured group in the Replace Occurrences process

To specify URL patterns, you can use 2 pattern types: Regular Expression and Wildcard.

### Regular Expression

Regular Expression is a powerful tool for matching patterns in text, powered by Apple's regular expression engine which is described [here](https://developer.apple.com/documentation/foundation/nsregularexpression#1661042). It allows you to define a specific pattern that matches a set of strings. Here are some examples:

- To match `https://example.com/hello`, you can use `https://example.com/(.*)`. This will match any string after `https://example.com/` and store it in a capture group.
- To match `https://example.com/search?q=hello`, you can use `https://example.com/search\?q=(.*)`. This will match the value of the `q` parameter and store it in a capture group.
- To match any URL that contains the word `blog`, you can use `.*blog.*`.

You can reference the captured groups in other options using `$1`, `$2`, etc.

Additionally, you can use `$0` to reference the entire URL that was matched.

You can learn more about Regex syntax in resources like [RegExr](https://regexr.com/).

### Wildcard

Wildcard is a simpler pattern type that allows you to use `*` and `?` as wildcards. Here are some examples:

- To match `https://example.com/hello`, you can use `https://example.com/*`. This will match any string after `https://example.com/`.
- To match `https://example.com/search?q=hello`, you can use `https://example.com/search?q=*`. This will match any value of the `q` parameter.
- To match any URL that contains the word `blog`, you can use `*blog*`.

You can also use back-referencing in Wildcard as well, which means you can reference the captured text using `$1`, `$2`, etc. For example, if you use `https://example.com/*-world-*`, and the URL is `https://example.com/hello-world-goodbye`, then `$1` would be "hello" and `$2` would be "goodbye". `$0` is also available to reference the entire URL that was matched.
