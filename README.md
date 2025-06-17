# tree-sitter-latte

This is a soft fork of [Tree sitter HTML](https:://github.com/tree-sitter/tree-sitter-html)

## Usage (helix)

Edit your languages.toml file (~/.config/helix/languages.toml)

```toml
[[language]]
name = "latte"
grammar = "latte"
scope = "text.html.latte"
file-types = ["latte"]
block-comment-tokens = { start = "{*", end = "*}" }
indent = { tab-width = 2, unit = "  " }

[[grammar]]
name = "latte"
source = { git = "https://github.com/Bleksak/tree-sitter-latte", rev = "48a69197249adc1fa50dc5ab73bd6105bd8d53af" }
```

Then copy contents of queries/helix folder into ~/.config/helix/runtime/queries/latte

```sh
mkdir -p ~/.config/helix/runtime/queries/latte
cp queries/helix/* ~/.config/helix/runtime/queries/latte/
```

## Usage (neovim)

We don't have neovim queries yet.

First add parser:

```lua
local parsers = require("nvim-treesitter.parsers").get_parser_configs()

parsers.latte = {
  install_info = {
    url = "https://github.com/Bleksak/tree-sitter-latte",
    files = { "src/parser.c", "src/scanner.c" },
    branch = "main",
  },
}
```


Then follow [adding queries](https://github.com/nvim-treesitter/nvim-treesitter#adding-queries).
