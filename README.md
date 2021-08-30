# qalc - an expressive & powerful calculator

<p>
    <a href="https://github.com/sponsors/theacodes" title="Sponsor me on GitHub!">
        <img src="https://badgen.net/badge/sponsor/%E2%9D%A4/purple?icon=github">
    </a>
</p>

This extension uses the incredibly powerful [Qalculate!](http://qalculate.github.io/) to bring quick, powerful mathematical expression evaluation and calculation to VSCode.

If you're an engineer that works with physical quantities this extension is your new best friend.

## Features

![qalc in action](images/qalc.gif)

Using the extension is short and sweet. You can run qalc on the current selection / line through the command palette.

**Even better**, you can run qalc and *replace the current selection / line* with the command palette or the keyboard shortcut **⌘ + ⇧ + /** (Mac) or **⌃ + ⇧ + /** (Windows / Linux).

The extension is clever enough that you can run the command on Markdown inline code blocks (`` `like this` ``), so it's fantastic for writing!

The real power comes from [`qalc`](http://qalculate.github.io/manual/qalc.html)- It is an extremely powerful calculator and you'll definitely want to check out the [manual](http://qalculate.github.io/manual/index.html) if you want to learn everything about it.

## Requirements

You must have [Qalculate!](https://qalculate.github.io/) installed. It's not hard, I promise.

If you're on a Mac, use [homebrew](https://brew.sh/):

```bash
brew install qalculate-gtk
```

If you're on Windows or Linux, head over to the [Qalculate! downloads](http://qalculate.github.io/downloads.html) page where you can snag pre-built binaries as well as the source code, if you're into that sort of thing.

## Extension Settings

Qalc has just one VSCode setting, `calc.settings`. It's a list of `set` commands which it passes along to `qalc`. There's a [full list of settings](https://qalculate.github.io/manual/qalc.html#SETTINGS) on the `qalc` man page.

For example:

```json
"qalc.settings": [
  "base 16",
  "divsign 2",
]
```

Would cause `qalc` to use hexadecimal and the division sign (`÷`) when displaying results:

```
# input
16/2
# before
16 ∕ 2 = 8
# after
16 ÷ 2 = 0x8
```

## Getting help

This extension uses [Qalculate!](http://qalculate.github.io/) for evaluating your expressions- so if you run into trouble that's the first place to start.

## License & contributing

This extension is licensed under the [MIT License](LICENSE) and [contributions are welcome!](https://github.com/theacodes/vscode-qalc).
