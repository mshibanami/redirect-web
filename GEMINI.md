# Gemini Code Understanding

This document outlines the structure and purpose of the `redirect-web` repository, as understood by the Gemini language model.

## Project Overview

This repository contains the source code for the website of "Redirect Web," a browser extension that allows users to redirect URLs. The website is built with [Docusaurus](https://docusaurus.io/), a modern static website generator.

The website serves several purposes:

* **Documentation:** It provides comprehensive documentation for the "Redirect Web" extension, including setup instructions, usage guides, and frequently asked questions.
* **Rule Library:** It hosts a curated library of redirect rules that users can easily import into the extension. These rules cover a wide range of use cases, from opening links in specific applications to modifying website behavior.
* **Release Notes:** It publishes release notes for new versions of the extension, keeping users informed about the latest features and bug fixes.

## Repository Structure

The repository is organized as follows:

* `docs/`: Contains the Markdown files for the documentation pages.
* `i18n/`: Contains the internationalization files for translating the website into multiple languages.
* `library/`: Contains the collection of redirect rules.
  * `rule-sets/`: Each subdirectory within this folder represents a single redirect rule, containing a `metadata.json` file with descriptive information and a `rule-set.json` file with the actual redirect logic.
* `src/`: Contains the source code for the Docusaurus website, including custom React components, CSS styles, and pages.
* `docusaurus.config.ts`: The main configuration file for the Docusaurus website.
* `package.json`: Defines the project's dependencies and scripts.

## Key Technologies

* **Docusaurus:** A static site generator for building documentation websites.
* **React:** A JavaScript library for building user interfaces.
* **TypeScript:** A typed superset of JavaScript that compiles to plain JavaScript.
* **MDX:** A format that allows embedding JSX in Markdown documents.
