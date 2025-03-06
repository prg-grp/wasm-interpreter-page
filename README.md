[![Github CI Status](https://github.com/WebAssembly/wabt/workflows/CI/badge.svg)](https://github.com/WebAssembly/wabt)

# Fork of WABT

Original repository [here](https://github.com/WebAssembly/wabt).

# Description

We added a few new keywords for students to implement:
- `i32.mod`: computes the modulo
- `i32.pow`: computes the power
- `copy`: copy the top of the stack
- `loopn`: pop the number of iterations `n` and repeats the next instruction `n` times
- `beginfm/endfm`: pop the `id` of a `funmacro` and defines the `funmacro` as the instructions between `beginfm` and `endfm`
- `callfm`: pop the `id` of a `funmacro` and executes it

To make it simpler, we disabled the type checker, so that the student don't have to worry about it.

The modified `wat2wasm` converter tool with code examples is available on the webpage of the repository [here](https://prg-grp.github.io/wasm-interpreter-page/wat2wasm).

# Repository

The private repository for this webpage is [here](https://github.com/prg-grp/wasm-interpreter).