# Issue Triage

If you are looking for a way to help the project, triaging issues is a great place to start.

## Responding to issues

Issues that are tagged `question / support` or `needs reproduction` are great places to help. If you can answer a question, it will help the asker as well as anyone searching. If an issue needs reproduction, you may be able to guide the reporter toward one, or even reproduce it yourself using [this technique](https://github.com/storybooks/storybook/blob/master/CONTRIBUTING.md#reproductions).

## Triaging issues

Once you've helped out on a few issues, if you'd like triage access you can help label issues and respond to reporters.

We use the following label scheme to categorize issues:

-   **type** - `bug`, `feature`, `question / support`, `discussion`, `greenkeeper`, `maintenance`.
-   **area** - `addon: x`, `addons-api`, `stories-api`, `ui`, etc.
-   **status** - `needs reproduction`, `needs PR`, `in progress`, etc.

All issues should have a `type` label. `bug`/`feature`/`question`/`discussion` are self-explanatory. `greenkeeper` is for keeping package dependencies up to date. `maintenance` is a catch-all for any kind of cleanup or refactoring.

They should also have one or more `area`/`status` labels. We use these labels to filter issues down so we can easily see all of the issues for a particular area, and keep the total number of open issues under control.

For example, here is the list of [open, untyped issues](https://github.com/storybooks/storybook/issues?utf8=%E2%9C%93&q=is%3Aissue%20is%3Aopen%20-label%3A%22bug%22%20-label%3A%22discussion%22%20-label%3A%22feature%22%20-label%3A%22maintenance%22%20-label%3A%22question%20%2F%20support%22%20-label%3A%22documentation%22%20-label%3A%22greenkeeper%22), or here is a list of [bugs that have not been modified since 2017-04-01](https://github.com/storybooks/storybook/issues?utf8=%E2%9C%93&q=is%3Aissue%20is%3Aopen%20label%3A%22bug%22%20updated%3A%3C%3D2017-04-01%20). For more info see [searching issues](https://help.github.com/articles/searching-issues/) in the Github docs.

If an issue is a `bug`, and it doesn't have a clear reproduction that you have personally confirmed, label it `needs reproduction` and ask the author to try and create a reproduction, or have a go yourself.

## Closing issues

-   Duplicate issues should be closed with a link to the original.
-   Unreproducible issues should be closed if it's not possible to reproduce them (if the reporter drops offline,
    it is reasonable to wait 2 weeks before closing).
-   `bug`s should be labelled `merged` when merged, and be closed when the issue is fixed and released.
-   `feature`s, `maintenance`s, `greenkeeper`s should be labelled `merged` when merged,
    and closed when released or if the feature is deemed not appropriate.
-   `question / support`s should be closed when the question has been answered.
    If the questioner drops offline, a reasonable period to wait is two weeks.
-   `discussion`s should be closed at a maintainer's discretion.
