# Redirect Rule

This page provides detailed information on how to set up redirect rules using Redirect Web.

## Options

### Type

Specify the **Type** option to control how the app handles redirection. You can choose from these:

* **Original** (Default)
    * This uses traditional Web APIs to control redirection. Additionally, it uses [the Tabs API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs) for a fallback.
    * You can use all the options other than [Resource Types](#resource-types) and [Request Methods](#request-methods) in [Redirect From](#redirect-from).
    * This is slower than the *Declarative* type and may cause extra network requests.
* **DNR** (Experimental):
    * This uses the [Declarative Net Request](https://developer.apple.com/documentation/safariservices/safari_web_extensions/blocking_content_with_your_safari_web_extension) (DNR) API to handle redirection.
    * This allows you to specify [Resource Types](#resource-types) ~~and [Request Methods](#request-methods)~~ in [Redirect From](#redirect-from).
    * You can't use some options, such as [Capturing Group Processing](#capturing-group-processing) and [Excluded URL Patterns](#excluded-url-patterns).
    * Currently, you can't include pipes (`|`) in your Regular Expression pattern. [Details](https://github.com/mshibanami/redirect-web/issues/44)
    * Since the DNR API still has some issues, we consider that is still an experimental feature. You can find the list of all the known issues [here](https://github.com/mshibanami/redirect-web/labels/DNR).

### Redirect From

The **Redirect From** option allows you to specify a URL pattern of web pages you want to redirect from. You can choose either Wildcard or Regular Expression.

For example, if you specify `https://example.com/*` with Wildcard, it matches `https://example.com/` or `https://example.com/hello`.

> [!NOTE]
> In the Redirect To option, You can reference the entire match using `$0` or partial matches using `$1`, `$2`, ... Check the details in [URL Pattern](#url-pattern) on this page.

#### Resource Types

Set the **Resource Types** option as the context in which a resource was fetched in a web request.
For example, if you set `script`, you can redirect the JavaScript files loaded by web pages.

Currently, these are available: 
`main_frame`, `sub_frame`, `stylesheet`, `script`, `image`, `font`, `xmlhttprequest`, `ping`, `media`, `websocket`, `other`

The default setting is `main_frame`, which is the top-level page loaded into a tab.

> [!WARNING]
> This is an option for [the DNR type](#type) and this is always `main_frame` if you choose *Original* for the *Type* option.

Please check the details of each resource type in [mdn web docs](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/declarativeNetRequest/ResourceType).

#### Request Methods

The **Resource Types** option lets you set the target HTTP methods of the source URL.

All methods are set by default.

Please check the details of each method in [mdn web docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods).

> [!WARNING]
>
> * This option is currently not available because Apple's implementation for the DNR type doesn't seem to handle it currently. We sent feedback to Apple as FB14502272.
> * This option is only for [the DNR type](#type).

### Redirect To

The **Redirect To** option specifies a destination URL you wish to redirect to, from the source URL matched with the *Redirect From* option. You can also substitute capturing groups with `$1`, `$2`, ... or the entire match with `$0`. These help you dynamically specify the destination. Check the details in [URL Pattern](#url-pattern) in this page.

For example, if you set the following rule:

* **Redirect From**: `https://google.com/*` (Wildcard)
* **Redirect To**: `https://apple.com/$1`

and it matches `https://google.com/hello`, then the destination URL will be `https://apple.com/hello`.

Additionally, You can modify the texts of `$1`, `$2`, ... before making substitutions. Check the [Capturing Group Processing](#capturing-group-processing) section for the details.

> [!TIP]
> You can specify a custom URL scheme to open an app. These are examples of apps that support deep linking:
>
> * Figma: `figma://file/Your_Figma_ID`
> * Firefox: `firefox://open-url?url=https://example.com/hello`
> * Google Chrome: `googlechromes://example.com`
> * Microsoft Edge: `microsoft-edge://example.com`
> * Notion: `notion://www.notion.so/Your_Note_ID`
> * Slack: `slack://open`

#### [macOS Only] Open in App

If you want to specify an app you wish to open the destination URL, use the **Application** combo box. This is only available on macOS.

> [!WARNING]
> You can only open an app that supports [App Sandbox](https://developer.apple.com/documentation/security/app_sandbox). Also, make sure that the app supports opening the URL you want to open.

### Capturing Group Processing

The **Capturing Group Processing** option allows you to specify how to process the captured groups you can substitute in the *Redirect To* option with `$1`, `$2`...

> [!WARNING]
> This option is only for [the Original type](#type).

These are how to make capturing groups:

* **Wildcard**: Texts matched with `*` and `?` are automatically captured.
* **Regular Expression**: Texts matched with part of the pattern inside `()` are captured.

You can choose one or more of the following processes:

* **URL Encode/Decode**: This applies [percent-encoding](https://en.wikipedia.org/wiki/Percent-encoding) or decoding to a capturing group. For example, if you encode `https://example.com/hello`, it's converted to `https%3A%2F%2Fexample.com%2Fhello`. Decode works in an opposite way.
* **Base64 Encode/Decode**: This decode/encode a text into [Base64](https://en.wikipedia.org/wiki/Base64). For example, you can encode `hello` to `aGVsbG8=`, and decode it back to `hello`.
* **Replace Occurrences**: This replaces one or more characters in a group, matched by a **Target**, with a **Replacement**. For example, if the *Group* is `hello` and the *Target* is `l` and the Replacement is `y`, it is modified to `heyyo`.

> [!NOTE]
> This is for processing each capturing group and it doesn't affect which URLs are excluded by the [Excluded URL Patterns](#excluded-url-patterns). For instance, let's say you have this rule:
>
> * **Redirect From**: `https://example.com/(hello.*)`
> * **Capturing Group Processing**:
>     * Group: `$1`
>     * Target: `.*` (Regular Expression)
>     * Replacement: `hello`
> * **Excluded URL Pattern**: `https://example.com/hello`
>
> In this case, `https://example.com/hello_world` will not be excluded while `https://example.com/hello` will be excluded.

### Excluded URL Patterns

The **Excluded URL Patterns** option allows you to specify the URLs that are not redirected. This can be useful to avoid redirect loops or to exclude certain parts of a website from being redirected.

You can specify excluded URL patterns using either Regular Expression or Wildcard pattern types.

### Examples

The **Examples** option allows you to test your redirect rule by providing sample URLs. By adding a sample URL, you can check if the rule works as expected before actually applying it.

### Comments

The **Comments** option allows you to add any notes or comments about your redirect rule. This can be useful for keeping track of why you created a specific rule or for providing context for others who might view your rules.

## URL Pattern

There are 3 options you can specify one or more URL patterns. *Redirect From*, *Excluded URL Patterns* and *Capturing Group Processing*. To specify them, you can choose either **Wildcard** or **Regular Expression**.

### Wildcard

**Wildcard** is a simpler pattern type that allows you to use `*` (matches anything) and `?`  (matches any single character) as wildcards. Here are some examples:

- To match `https://example.com/hello`, you can use `https://example.com/*`. This will match any string after `https://example.com/`.
- To match `https://example.com/search?q=hello`, you can use `https://example.com/search?q=*`. This will match any value for the `q` parameter.
- To match any URL that contains the word `blog`, you can use `*blog*`.

You can also use substitution in Wildcard as well, which means you can reference portions of the matched URL using `$1`, `$2`, etc. For example, if you use `https://example.com/*-world-*`, and the URL is `https://example.com/hello-world-goodbye`, then `$1` would be "hello" and `$2` would be "goodbye". `$0` is also available to reference the entire URL matched.

> [!Note]
> Although substitution is a feature of Regular Expression, you can also use it for Wildcard because Redirect Web internally converts Wildcard to Regular Expression.

### Regular Expression

**Regular Expression** is a powerful tool for matching patterns in text, powered by Apple's regular expression engine which is described [here](https://developer.apple.com/documentation/foundation/nsregularexpression#1661042). It allows you to define a specific pattern that matches a set of strings. Here are some examples.

- To match `https://example.com/hello`, you can use `https://example.com/(.*)`. This will match any string after `https://example.com/` and store it in a capturing group.
- To match `https://example.com/search?q=hello`, you can use `https://example.com/search\?q=(.*)`. This will match the value of the `q` parameter and store it in a capturing group.
- To match any URL that contains the word `blog`, you can use `.*blog.*`.

You can reference the capturing groups in *Redirect To* or *Replacement* using `$1`, `$2`, ... or `$0` to reference the entire match.

You can learn more about Regex syntax in resources like [RegExr](https://regexr.com/).
