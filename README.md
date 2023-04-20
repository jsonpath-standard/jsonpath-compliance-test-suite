# JSONPath Compliance Test Suite

**WORK IN PROGRESS**

This Compliance Test Suite follows, and usually lags behind, the [internet draft](https://github.com/ietf-wg-jsonpath/draft-ietf-jsonpath-jsonpath).

See [cts.json](cts.json) for the Compliance Test Suite.

See the [Contributor Guide](./CONTRIBUTING.md) if you'd like to submit changes.

To use this test suite, it's recommended you embed this repository as a git submodule of your implementation.

### Conventions

Basic conventions around source file formatting are captured in the `.editorconfig` file.
Many editors support that file natively. Others (such as VS code) require a plugin, see https://editorconfig.org/.

### Contributing

To add or modify a test suite, edit the corresponding file in the `tests` directory.
To generate `cts.json`, run the `build.sh` located in the root folder. Do not modify `cts.json` directly.
More details are available in the [Contributor Guide](./CONTRIBUTING.md).
