# Getting Started

This page describes common use cases for creating redirect rules in the Redirect Web app.

(You can also learn the details of rule settings on the [Redirect Rule](./redirect-rule.md) page.)


## Case 1: Open another website

Suppose you're addicted to Twitter, and you decide to meditate in Insight Timer whenever you accidentally open Twitter. Let's create a rule for that!

### Step 1. Set up "Redirect From"

First, you should set up the *Redirect From* section in the *Edit Rule* screen in the app. The targets are URLs starting with `https://twitter.com/`.

In this case, you can specify the following pattern with the [Wildcard](redirect-rule?id=wildcard) mode:

```
https://twitter.com/*
```

In the Wildcard mode, `*` means it matches anything (= zero or more characters).

However, hold on. `twitter.com` was renamed to `x.com`. You can simply replace `twitter.com` with `x.com` but no one knows when the new owner will change his mind again to roll it back. Therefore, let's target both `twitter.com` and `x.com`.

To do that, switch from Wildcard to [Regular Expression](redirect-rule?id=regular-expression), and set this as the pattern:

```
https://(twitter|x).com/.*
```

* `(twitter|x)`: it targets both `twitter` and `x`. (`|` is called *a pipe*.)
* `.*`: It's the same as Wildcard's `*`. More specifically, `.` means *any character* and `*` means *anything before this symbol repeated any number of times*, resulting in it matches anything.

It's a bit complicated, but once you get used to it, it will be a super powerful tool. We recommend using [RegExr](https://regexr.com) as a playground to analyze how your Regular Expression pattern works.

> [!NOTE]
> In Regular Expressions, `.` in `(twitter|x).com` is also treated as *any character*. Therefore, `(twitter|x).com/.*` also matches, for example, `twitter1com/` or `x_com/`.
> 
> To avoid it, you can change it to `(twitter|x)\.com/.*`. `\` is used to escape a special character.
>
> However, there are no such URLs in the general internet environment. Therefore, you can leave `.` as a special character if you prefer. Your rule is for your own use, so implement it as you see fit.

### Step 2: Set up "Redirect To"

Simply specify the URL as follows:

```
https://insighttimer.com/saraauster/guided-meditations/calm
```

Now, Redirect Web brings you to the meditation when you access Twitter!

**[⬇️ Download the Rule](assets/reduce-twitter-addiction.redirectweb ':ignore')**


## Case 2: Add Query Parameters to URL

Let's say there is a website called `example.com` that shows a mobile layout by default, but you prefer their desktop layout. Fortunately, the website supports a `layout` query parameter to specify which layout the website displays. Let's create a rule that adds `layout=desktop` automatically.

Perhaps you think you could define it as follows:

* **Redirect From**: `https://example.com/.*` (Regular Expression)
* **Redirect To**: `$0?layout=desktop`

`$0` references the target URL. If you try to access `example.com/hello`, you're redirected to `example.com/hello?layout=desktop`. This feature is called *substitution*.

> [!TIP]
> Substitution is also available for the Wildcard mode since it's internally converted to Regular Expression.

However, there are a few problems with these settings.

### Problem 1: Infinite loop

The current setting creates an infinite redirect loop since `https://example.com/.*` also targets `https://example.com/hello?layout=desktop`.

In this case, you can specify an excluded URL pattern that allows you to access without redirection, like this with Regular Expression:

```
.*[&?]layout=[^&]*.*
```

* `.*`: Matches anything
* `[&?]`: Matches either `&` or `?`
* `[^&]`: Matches *any character except `&`

### Problem 2: Can't handle existing parameters properly

If the target URL already has other query parameters like `example.com/hello?theme=dark`, the destination will be `example.com/hello?theme=dark?layout=desktop` (There are two `?` in the URL) but you can only join the parameters with `&`. `?` as a special character is only allowed at the beginning of the parameters. So it's not treated as a valid parameter.

In this case, change the settings like this:

* **Redirect From**: `(https://example.com/[^?]*)(\?(.*))?`
* **Redirect To**: `$1?layout=desktop&$3`

Let's take a look step by step.

* `(https://example.com/[^?]*)`: Matches the part until the previous character of `?`.
    * `[^?]` matches *any character except `?`.
    * This is wrapped with `()` so you can reference it with `$1` later.
* `(\?(.*))?`: Matches a string start with `?`, which means query parameters.
    * This also matches empty string by the `?` quantifier at the end of the pattern, which *matches zero or one time*.
    * The outer `()` and the inner `()` can be referenced with `$2` and `$3` later.

[RegExr](https://regexr.com) may help you understand the details.

> [!NOTE]
> RegExr shows an error when you don't escape `/` with `\`. Although you can escape it, it's not required since Redirect Web uses a different engine by Apple that doesn't require escaping.

This is not a perfect solution, as it redirects `example.com/hello` to `example.com/hello?layout=desktop&`, which includes an unnecessary `&` at the end of the URL. It's not a big deal in general, but if you wish to remove it, you can use *Capturing Group Processing*.

In conclusion, this is the final output:

* **Redirect From**: `(https://example.com/[^?]*)((\?(.*))?)` (Regular Expression)
* **Redirect To**: `$1?layout=desktop$3`
* **Excluded URL Pattern**: `.*[&?]layout=[^&]*.*` (Regular Expression)
* **Capturing Group Processing**:
    * **Group**: `$3`
    * **Process**: Replace Occurrences
        * **Target**: `\?(.*)`
        * **Replacement**: `&$1`

**[⬇️ Download the Rule](assets/add-parameters.redirectweb ':ignore')**

This is merely an example. You can also create multiple rules to handle each problem. It can be much simpler.


## Case 3: Remove Query Parameters from URL

Suppose you find out a query parameter `source=twitter` that a website `example.com` uses to track you, and you decide to remove it to anonymize yourself.

The rule would look like this:

* **Redirect From**: `(https://example.com/[^?]*)(.*[&?])(source=[^&]*)(.*)` (Regular Expression)
* **Redirect To**: `$1$2$4`

**[⬇️ Download the Rule](assets/remove-parameters.redirectweb ':ignore')**

The destination may include unnecessary characters such as `?` at the end, `&&`, and `?&`. Although they don't cause any problems in general, check the rule you can download from the following link if you wish to remove them:

**[⬇️ Download the Rule](assets/remove-parameters-without-junks.redirectweb ':ignore')**
