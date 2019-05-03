# Conventional commits hook


> Prepend the commit with a type 

## Install

```
$ npm install -g tjoskar/conventional-commits-hook
```

- Install the hook

```
$ cd any-git-initialized-directory
$ conventional-commits-hook --init
```

## Usage

Just run git commit as you always do

## Develop

To run the linter: `npm run lint`

To dry run the script:
```bash
node invoke.js --init # run the init setup

node invoke.js mock_hooks/COMMIT_EDITMSG # simulate a git commit
```

## Related

[gitmoji-commit-hook](https://github.com/tjoskar/gitmoji-commit-hook)

## License

The code is available under the [WTFPL](http://www.wtfpl.net/about/) license.
