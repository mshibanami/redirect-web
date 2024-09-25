# Library

![Library Screenshot](../assets/library-screenshot.webp)

The library is shown in the Redirect Web apps and the data under this `library` folder may be used in the app.

## Rule Sets

Rule sets within the library are managed at the [rule-sets](rule-sets) folder.

Each rule is identified by a unique integer ID. All data in a rule set should be in a folder named `{id}_{short-title-of-rule-set}`. This folder should contain:

- `rule-set.json`
- `metadata.json`
- Image files (optional)

Folders of deleted rule sets remain like `8_DELETED`, ensuring that IDs remain unique.

You can submit a pull request to add your rule to the library.

> [!WARNING]
> Old rules will persist in the Git history, although you can modify or remove your rules after creation.

### `rule-set.json`

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

### `metadata.json`

This file contains metadata of a rule set.

```json
{
    "contributorGitHubIds": [
      "<your-github-id>"
    ],
    "imageFiles": [
      "image.png"
    ],
    "aboutUrl": "<URL to the rule set details>",
    "title": "<A title of the rule set>",
    "description": "<A description of the rule set.>",
    "primaryCategoryId": "gaming",
    "secondaryCategoryId": "productivity",
    "supportedDeviceTypes": ["desktop", "tablet"]
}
```

- `contributorGitHubIds`: An array of contributors' GitHub IDs, sorted by the date they were involved in the rule.
- `imageFiles`:An array of image files of the rule set.
    - JPEG, PNG, and WebP are supported.
    - The recommended image size is under 1MB with 16:10 aspect ratio, but it's just a recommendation. There are no strict rules.
- `aboutUrl` (optional): A link to a web page where users can learn more about the rule set.
- `title` (optional): A short title of the rule set. This is optional when the first rule in the rule set has non-empty `title`.
- `description` (optional): A description of the rule set. This is optional when the first rule in the rule set has non-empty `comments`.
- `primaryCategoryId`: A primary category ID of the rule set. Find a list of the categories in [categories.json](./categories.json).
- `secondaryCategoryId` (optional): A secondary category ID of the rule set.
- `supportedDeviceTypes` (optional): An array of device types that support the rule set.
    - `desktop`, `tablet` and `phone` are available.
    - All devices are supported by default.
