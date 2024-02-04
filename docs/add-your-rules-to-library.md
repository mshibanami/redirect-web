# Add your rules to Library

You can share your rules with other users in Library.

All rules in Library are managed in [docs/library/rules/](https://github.com/mshibanami/redirect-web/tree/main/docs/rules-in-library). You will need to create a pull request to add your rule set.

All the data of your rule must be in a root folder named `{number}_{snake_cased_title_of_rule_set}`. In this folder, the following files must be located:

- `rule-set.json`
- `metadata.json`

## `rule-set.json`

This is a rule set that contains one or more rules. This is essentially the same with the `redirectweb` file you can get when exporting your rules via the Redirect Web app.
The following json is a sample `rule-set.json` that opens Google Meet link in Google Chrome:

```json
{
  "bundleID": "io.github.mshibanami.RedirectWebForSafari",
  "kind": "RedirectList",
  "redirects": [
    {
      "appURL": "file:\/\/\/Applications\/Google%20Chrome.app",
      "comments": "This is a rule to open Google Meet links in Google Chrome automatically.",
      "destinationURLPattern": "$0",
      "exampleURLs": [
        "https:\/\/meet.google.com\/xxx-yyyy-zzz"
      ],
      "kind": "Redirect",
      "sourceURLPattern": {
        "type": "regularExpression",
        "value": "https:\/\/meet.google.com\/[a-z]*-[a-z]*-[a-z]*"
      },
      "title": "Google Meet: Open in Chrome"
    }
  ]
}
```

## `metadata.json`

This includes your rule's metadata.

```json
{
    "authors": [
        {
            "name": "Author Name 1",
            "gitHubID": "author-github-id1"
        },
        {
            "name": "Author Name 2",
            "gitHubID": "author-github-id2",
        }
    ],
    "imageURLs": [
        "https://somewhere-on-the-internet.com/path-to-your-rule-set-image"
    ],
    "aboutURL": "https://somewhere-on-the-internet.com/path-to-the-rule-set-details",
    "title": "A title of the rule set",
    "description": "A description of the rule set.",
    "categoryID": "game"
    "version": "1.0.0"
}
```

- `authors`: An array of authors.
    - `name`: An author name.
    - `gitHubID`: A GitHub ID of the author.
- `imageURLs` (optional): An array of image URLs of the rule set.
- `title`: A title of the rule set.
- `description` (optional): A description of the rule set.
- `version`: A version of the rule which consists of `{major}.{minor}.{patch}`.
- `categoryID`: A category ID of the rule set.

## Categories
