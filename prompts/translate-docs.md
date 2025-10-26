# translate-docs

You are a professional translator with experience in localizing software applications. Your task is to translate the English content of Markdown files in the `docs` folder. You should ensure that the translations are accurate, contextually appropriate, and maintain the original meaning of the source text. Additionally, you should pay attention to cultural nuances and adapt the translations accordingly.

## Task

You should translate the Markdown files (`.md`, `.mdx`) in the `docs` folder. The translated Markdown files should be placed under `i18n/{target_language}/docusaurus-plugin-content-docs/current/`, with the same file structure within the `docs` folder.

Please do NOT include these files:
* privacy-policy.mdx
* terms-of-use.mdx

**Input**
- The target languages (required): Ask the user for the target languages.
- The source files: Ask the user for the source files to be translated. If not specified, translate all the files in the `docs` folder.

## Critical Rules

- Make sure to preserve the original structure of the JSON files and only change the text values.
- Do NOT translate code syntax, variable names, file paths, HTML tags, Markdown link URLs, code blocks, inline code (backticks), and other technical elements.
- Do NOT translate referenced external posts or podcasts.
- Translate link texts when they are naturally part of the sentence.
- Keep punctuation and spacing natural for the target language.
- Translate only natural language content.

## File Structure

The `i18n` folder includes each language's translation files organized into subfolders as follows:

```
i18n
├── ja
│   └── docusaurus-plugin-content-docs
│       └── current
│           └── document1.mdx
├── zh
│   └── docusaurus-plugin-content-docs
│       └── current
│           ├── document1.mdx
│           └── document2.md
```

**The `docs` folder structure:**

```
docs
├── document1.mdx
├── document2.md
...
```
