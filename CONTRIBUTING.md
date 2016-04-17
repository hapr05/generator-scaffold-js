# Contributing to scaffold-js

**First off, thanks for taking the time to contribute!**

The following is a set of guidelines for contributing to **scaffold-js** and its packages, which are hosted in the   [scaffold-js](https://github.com/scaffold-js) repository on GitHub.
These are just guidelines, not rules, use your best judgment and feel free to propose changes to this document in a pull request.

#### Table Of Contents

[How Can I Contribute?](#how-can-i-contribute)
  * [Reporting Bugs](#reporting-bugs)
  * [Suggesting Enhancements](#suggesting-enhancements)
  * [Your First Code Contribution](#your-first-code-contribution)
  * [Pull Requests](#pull-requests)

[Styleguides](#styleguides)
  * [Git Commit Messages](#git-commit-messages)
  * [CoffeeScript Styleguide](#coffeescript-styleguide)
  * [Specs Styleguide](#specs-styleguide)
  * [Documentation Styleguide](#documentation-styleguide)

[Additional Notes](#additional-notes)
  * [Issue and Pull Request Labels](#issue-and-pull-request-labels)

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report for **scaffold-js**. Following these guidelines helps maintainers and the community understand your report, reproduce the behavior, and find related reports:.

Before creating bug reports, please check [this list](#before-submitting-a-bug-report) as you might find out that you don't need to create one. When you are creating a bug report, please [include as many details as possible](#how-do-i-submit-a-good-bug-report). If you'd like, you can use [this template](#template-for-submitting-bug-reports) to structure the information.

#### Before Submitting A Bug Report

* **Perform a [cursory search](https://github.com/scaffold-js/generator-scaffold-js/issues)** to see if the problem has already been reported. If it has, add a comment to the existing issue instead of opening a new one.

#### How Do I Submit A (Good) Bug Report?

Bugs are tracked as [GitHub issues](https://guides.github.com/features/issues/). When you create an issue provide the following information.

Explain the problem and include additional details to help maintainers reproduce the problem:

* **Use a clear and descriptive title** for the issue to identify the problem.
* **Describe the exact steps which reproduce the problem** in as many details as possible. When listing steps, **don't just say what you did, but explain how you did it**.
* **Provide specific examples to demonstrate the steps**. Include links to files or GitHub projects, or copy/pasteable snippets, which you use in those examples. If you're providing snippets in the issue, use [Markdown code blocks](https://help.github.com/articles/markdown-basics/#multiple-lines).
* **Describe the behavior you observed after following the steps** and point out what exactly is the problem with that behavior.
* **Explain which behavior you expected to see instead and why.**
* **Include screenshots** which show you following the described steps and clearly demonstrate the problem.
* **If the problem wasn't triggered by a specific action**, describe what you were doing before the problem happened and share more information using the guidelines below.

Provide more context by answering these questions:

* **Did the problem start happening recently** (e.g. after updating to a new version of **scaffold-js**) or was this always a problem?
* If the problem started happening recently, **can you reproduce the problem in an older version of scaffold-js?** What's the most recent version in which the problem doesn't happen? You can download older versions of **scaffold-js++ from [the releases page](https://github.com/scaffold-js/generator-scaffold-js/releases).
* **Can you reliably reproduce the issue?** If not, provide details about how often the problem happens and under which conditions it normally happens.

Include details about your configuration and environment:

* **Which version of scaffold-js are you using?**
* **What's the name and version of the OS you're using**?
* **Are you running scaffold-js in a virtual machine?** If so, which VM software are you using and which operating systems and versions are used for the host and the guest?

#### Template For Submitting Bug Reports

    [Short description of problem here]

    **Reproduction Steps:**

    1. [First Step]
    2. [Second Step]
    3. [Other Steps...]

    **Expected behavior:**

    [Describe expected behavior here]

    **Observed behavior:**

    [Describe observed behavior here]

    **Screenshots**

    ![Screenshots which follow reproduction steps to demonstrate the problem](url)

    **scaffold-js version:** [Enter scaffold-js version here]
    **OS and version:** [Enter OS name and version here]

    **Additional information:**

    * Problem started happening recently, didn't happen in an older version of Atom: [Yes/No]
    * Problem can be reliably reproduced, doesn't happen randomly: [Yes/No]

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for **scaffold-js**, including completely new features and minor improvements to existing functionality. Following these guidelines helps maintainers and the community understand your suggestion and find related suggestions.

Before creating enhancement suggestions, please check [this list](#before-submitting-an-enhancement-suggestion) as you might find out that you don't need to create one. When you are creating an enhancement suggestion, please [include as many details as possible](#how-do-i-submit-a-good-enhancement-suggestion). If you'd like, you can use [this template](#template-for-submitting-enhancement-suggestions) to structure the information.

#### Before Submitting An Enhancement Suggestion

* **Perform a [cursory search](https://github.com/scaffold-js/generator-scaffold-js/issues)** to see if the enhancement has already been suggested. If it has, add a comment to the existing issue instead of opening a new one.

#### How Do I Submit A (Good) Enhancement Suggestion?

Enhancement suggestions are tracked as [GitHub issues](https://guides.github.com/features/issues/). When you create an issue provide the following information:

* **Use a clear and descriptive title** for the issue to identify the suggestion.
* **Provide a step-by-step description of the suggested enhancement** in as many details as possible.
* **Provide specific examples to demonstrate the steps**. Include copy/pasteable snippets which you use in those examples, as [Markdown code blocks](https://help.github.com/articles/markdown-basics/#multiple-lines).
* **Describe the current behavior** and **explain which behavior you expected to see instead** and why.
* **Include screenshots** which help you demonstrate the steps or point out the part of **scaffold-js** which the suggestion is related to.
* **Explain why this enhancement would be useful** to most **scaffold-js** users.
* **List some other applications where this enhancement exists.**
* **Specify which version of scaffold-js you're using.**
* **Specify the name and version of the OS you're using.**

#### Template For Submitting Enhancement Suggestions

    [Short description of suggestion]

    **Steps which explain the enhancement**

    1. [First Step]
    2. [Second Step]
    3. [Other Steps...]

    **Current and suggested behavior**

    [Describe current and suggested behavior here]

    **Why would the enhancement be useful to most users**

    [Explain why the enhancement would be useful to most users]

    [List some other applications where this enhancement exists]

    **Screenshots**

    ![Screenshots and GIFs which demonstrate the steps or part of **scaffold-js** the enhancement suggestion is related to](url)

    **scaffold-js Version:** [Enter scaffold-js version here]
    **OS and Version:** [Enter OS name and version here]

### Your First Code Contribution

Unsure where to begin contributing to **scaffold-js**? You can start by looking through these `beginner` and `help-wanted` issues:

* [Beginner issues](https://github.com/scaffold-js/generator-scaffold-js/labels/beginner) - issues which should only require a few lines of code, and a test or two.
* [Help wanted issues](https://github.com/scaffold-js/generator-scaffold-js/labels/help%20wanted) - issues which should be a bit more involved than `beginner` issues.

### Pull Requests

* Include screenshots in your pull request whenever possible.
* Follow the [stylegudes](#styleguides).
* Include thoughtfully-worded, well-structured unit tests for both the generator and generated code.
* Ensure your changes maintain 100% code coverage without ignore comments.
* Avoid platform-dependent code:
    * Use `require('fs-plus').getHomeDirectory()` to get the home directory.
    * Use `path.join()` to concatenate filenames.
    * Use `os.tmpdir()` rather than `/tmp` when you need to reference the temporary directory.

## Styleguides

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally

### Unit Test Styleguide

- Include thoughtfully-worded, well-structured unit tests.
- treat `describe` as a noun or situation.
- treat `it` as a statement about state or how an operation changes state.

#### Example

```
describe ('a dog', () => {
 it ('barks', () => {
  # spec here
 });
 
 describe ('when the dog is happy', () => {
  it ('wags its tail', () => {
   # spec here
  });
 });
});
```

## Additional Notes

### Issue and Pull Request Labels

This section lists the labels we use to help us track and manage issues and pull requests.

[GitHub search](https://help.github.com/articles/searching-issues/) makes it easy to use labels for finding groups of issues or pull requests you're interested in.

#### Type of Issue and Issue State

| Label name | Description |
| --- | --- |
| `enhancement` | Feature requests. |
| `bug` | Confirmed bugs or reports that are very likely to be bugs. |
| `question` | Questions more than bug reports or feature requests (e.g. how do I do X). |
| `feedback` | General feedback more than bug reports or feature requests. |
| `help-wanted` | The **scaffold-js** core team would appreciate help from the community in resolving these issues. |
| `beginner` | Less complex issues which would be good first issues to work on for users who want to contribute to **scaffold-js**. |
| `information-needed` |  More information needs to be collected about these problems or feature requests (e.g. steps to reproduce). |
| `needs-reproduction` | Likely bugs, but haven't been reliably reproduced. |
| `blocked` | Issues blocked on other issues. |
| `duplicate` | Issues which are duplicates of other issues, i.e. they have been reported before. |
| `wontfix` | The **scaffold-js** core team has decided not to fix these issues for now, either because they're working as intended or for some other reason. |
| `invalid` | Issues which aren't valid (e.g. user errors). |

#### Status Labels

| Label name | Description
| --- | --- |
| `ready` | Issue is elaborated and ready to be worked and can be picked up for development. |
| `in progress` | Issue is currently being worked on. |
