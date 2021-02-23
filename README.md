![Gulp Logo](https://upload.wikimedia.org/wikipedia/commons/7/72/Gulp.js_Logo.svg)

## What is gulp?

- **Automation** - gulp is a toolkit that helps you automate painful or time-consuming tasks in your development workflow.
- **Platform-agnostic** - Integrations are built into all major IDEs and people are using gulp with PHP, .NET, Node.js, Java, and other platforms.
- **Strong Ecosystem** - Use npm modules to do anything you want + over 3000 curated plugins for streaming file transformations.
- **Simple** - By providing only a minimal API surface, gulp is easy to learn and simple to use.

## What's new in 4.0?!

- The task system was rewritten from the ground-up, allowing task composition using `series()` and `parallel()` methods.
- The watcher was updated, now using chokidar (no more need for gulp-watch!), with feature parity to our task system.
- First-class support was added for incremental builds using `lastRun()`.
- A `symlink()` method was exposed to create symlinks instead of copying files.
- Built-in support for sourcemaps was added - the gulp-sourcemaps plugin is no longer necessary!
- Task registration of exported functions - using node or ES exports - is now recommended.
- Custom registries were designed, allowing for shared tasks or augmented functionality.
- Stream implementations were improved, allowing for better conditional and phased builds.

## Tasks :runner:

- **default**: Run functions from above and watch for file changes
- **build**: Minify, compile and copy every file into dist/
- **bundle**: Build production version and compress file into zip

## Get started

Requirements:

- :heavy_check_mark: [NPM (Node)](https://nodejs.org/en/) installed
- :heavy_check_mark: [Gulp-CLI](https://gulpjs.com/) installed
