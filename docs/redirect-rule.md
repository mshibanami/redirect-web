# Redirect Rule

This section provides detailed information on how to set up redirect rules using Redirect Web.

## Options

### Redirect From

The Redirect From option allows you to specify the URL pattern of the website you want to redirect from. You can choose a URL pattern type from Regular Expression and Wildcard to specify the URL pattern.

For example, if you specify `https://example.com/*` with a wildcard, then, it matches, for example, `https://example.com/` or `https://example.com/hello`.

The matched URLs can be referenced in the Redirect To option, using `$0`, `$1` ... which is called substitution. Check the details in [URL Pattern](#url-pattern) on this page.

### Redirect To

The **Redirect To** option specifies a destination URL you wish to redirect to, from the URL matched with the Redirect From option. You can use substitution using `$0`, `$1`, ... to dynamically generate the URL. Check the details in [URL Pattern](#url-pattern) in this page.

For example, if you set the following rule:

- **Redirect From**: `https://google.com/*` (Wildcard)
- **Redirect To**: `https://apple.com/$1`

and it matches `https://google.com/hello`, then the destination URL will be `https://apple.com/hello`.

You can also specify a custom URL scheme to open an app, such as `mailto:` to open the default email client. To specify an app, use the format `app:<bundle identifier>/<URL>`. For example, to open the Notion app with a specific page, use `app:notion://openPage?pageId=<page ID>`.

[macOS Only] If you want to specify an app you wish to open the destination URL, use the Application combo box.

> [!WARNING]
> You can only open an app that supports [App Sandbox](https://developer.apple.com/documentation/security/app_sandbox). Also, make sure that the app supports opening the URL you want to open.

You can also specify the Capture Group Processing option to process the text captured by the pattern in the Redirect To option. Please see the details in the [Capture Group Processing](#capture-group-processing) section below.

### Capture Group Processing

The Capture Group Processing option allows you to specify how to process the text captured by the pattern in the Redirect To option. You can choose one or more of the following processes:

- URL Encode/Decode
- Base64 Encode/Decode
- Replace Occurrences

Please note that this setting is for processing each captured group and it doesn't affect which URLs are excluded by the Excluded URL Patterns. For instance, let's say you have this rule:

- **Redirect From**: `https://example.com/(hello.*)`
- **Capture Group Process**: Replace `.*` with `hello` for `$1`
- **Excluded URL Pattern**: `https://example.com/hello`

In this case, `https://example.com/hello_world` will not be excluded while `https://example.com/hello` will be excluded.

### Excluded URL Patterns

The Excluded URL Patterns option allows you to specify the URLs that are not redirected. This can be useful to avoid redirect loops or to exclude certain parts of a website from being redirected.

You can specify excluded URL patterns using either Regular Expression or Wildcard pattern types.

### Examples

The Examples option allows you to test your redirect rule by providing sample URLs. By adding a sample URL, you can check if the rule works as expected before actually applying it.

### Comments

The Comments section allows you to add any notes or comments about your redirect rule. This can be useful for keeping track of why you created a specific rule or for providing context for others who might view your rules.

## URL Pattern

There are 3 options you can specify one or more URL patterns:

- **Redirect From**: To specify the target URLs.
- **Excluded URL Patterns**: To specify the URLs that aren't redirected.
- **Capture Group Processing**: To specify the target string appearing in a captured group during the Replace Occurrences process.

To specify URL patterns, you can use 2 pattern types: Regular Expression and Wildcard.

### Regular Expression

Regular Expression is a powerful tool for matching patterns in text, powered by Apple's regular expression engine which is described [here](https://developer.apple.com/documentation/foundation/nsregularexpression#1661042). It allows you to define a specific pattern that matches a set of strings. Here are some examples.

- To match `https://example.com/hello`, you can use `https://example.com/(.*)`. This will match any string after `https://example.com/` and store it in a capture group.
- To match `https://example.com/search?q=hello`, you can use `https://example.com/search\?q=(.*)`. This will match the value of the `q` parameter and store it in a capture group.
- To match any URL that contains the word `blog`, you can use `.*blog.*`.

You can reference the captured groups in other options using `$1`, `$2`, etc.

Additionally, you can use `$0` to reference the entire URL that was matched.

You can learn more about Regex syntax in resources like [RegExr](https://regexr.com/).

### Wildcard

A Wildcard is a simpler pattern type that allows you to use `*` and `?` as wildcards. Here are some examples:

- To match `https://example.com/hello`, you can use `https://example.com/*`. This will match any string after `https://example.com/`.
- To match `https://example.com/search?q=hello`, you can use `https://example.com/search?q=*`. This will match any value for the `q` parameter.
- To match any URL that contains the word `blog`, you can use `*blog*`.

You can also use substitution in Wildcard as well, which means you can reference portions of the matched URL using `$1`, `$2`, etc. For example, if you use `https://example.com/*-world-*`, and the URL is `https://example.com/hello-world-goodbye`, then `$1` would be "hello" and `$2` would be "goodbye". `$0` is also available to reference the entire URL that was matched.
