# Library

The library is shown in the Redirect Web apps and the data under the `library` folder may be used in the app.

## Rule Sets

Rule sets within the library are managed at [library/rule-sets](https://github.com/mshibanami/redirect-web/tree/main/library/rule-sets).

Each rule is identified by a unique integer ID. All data in a rule set should be in a folder named `{id}_{short-title-of-rule-set}`. This folder should contain:

- `rule-set.json`
- `metadata.json`
- Image files (optional)
- Video files (optional)

Folders of deleted rule sets remain like `8_DELETED`, ensuring that IDs remain unique.

You can submit a pull request to add your rule to the library.

> [!WARNING]
> Old rules will persist in the Git history, although you can modify or remove your rules after creation.

## `rule-set.json`

This file defines a rule set containing one or more rules. It's essentially equivalent to the `redirectweb` file you can get by exporting your rules from the Redirect Web apps.

> [!NOTE]
> The file extension is `json` because it's easier to browse on GitHub.

Below is an example of `rule-set.json` that configures Google Meet links to open in Google Chrome:

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

This file contains metadata of a rule set.

```json
{
    "contributorGitHubIds": [
      "<your-github-id>"
    ],
    "imageFiles": [
      "image.png"
    ],
    "videoFiles": [
      "video.mp4"
    ],
    "aboutURL": "<URL to the rule set details>",
    "title": "<A title of the rule set>",
    "description": "<A description of the rule set.>",
    "primaryCategoryId": "gaming",
    "secondaryCategoryId": "productivity"
}
```

- `contributorGitHubIds`: An array of contributors' GitHub IDs, sorted by the date they were involved in the rule.
- `aboutURL` (optional): A link to a webpage where users can learn more about the rule set.
- `title`: A short title of the rule set.
- `description`: A description of the rule set. This is optional when the first rule in the rule set has non-empty `comments`.
- `primaryCategoryId`: A primary category ID of the rule set. Find a list of the categories in [categories.json](./categories.json).
- `secondaryCategoryId` (optional): A secondary category ID of the rule set.

## Image files (optional)

Images of the rule set.
PNG and JPEG images are supported.

## Video files (optional)

A list of video URLs for the rule set.
Video formats that QuickTime Player can play are supported.
