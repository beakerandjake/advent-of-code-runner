# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.8.0] - 2024-11-29
### Changed
- Updated configuration to support 2024. ([#246](https://github.com/beakerandjake/advent-of-code-runner/issues/247))

## [1.7.1] - 2023-12-28
### Fixed
- Updated template `package.json` to include npm script for the `import` command ([#242](https://github.com/beakerandjake/advent-of-code-runner/issues/242))

## [1.7.0] - 2023-12-27
### Added
- Added `import` command which stores correct answers to problems submitted outside of the cli. ([#20](https://github.com/beakerandjake/advent-of-code-runner/issues/20) and [#240](https://github.com/beakerandjake/advent-of-code-runner/issues/240))

## [1.6.1] - 2023-12-01
### Fixed
- Fixed issue with puzzle unlock time being 2pm EST instead of midnight EST ([#238](https://github.com/beakerandjake/advent-of-code-runner/issues/238))

## [1.6.0] - 2023-11-17
### Changed
- Remove dependencies:  dom-serializer, domutils, htmlparser2

### Fixed
- Fix submission response parsing. Now handles more server responses with better output to the user. ([#223](https://github.com/beakerandjake/advent-of-code-runner/issues/223))

## [1.5.0] - 2023-11-16
### Added
- Add devDependencies: jest-extended

### Changed
- Input files are ignored in source control by default ([#231](https://github.com/beakerandjake/advent-of-code-runner/issues/231))
- Deprecate action chains and major rewrite of commands ([#232](https://github.com/beakerandjake/advent-of-code-runner/issues/232))
- All commands have much better unit testing.
- Logging output less verbose when running commands.
- Upgrade dependencies: commander 11.1.0
- Upgrade devDependencies: jest 29.7.0

## [1.4.0] - 2023-11-13
### Added
- Added support for 2023 to the config file ([#226](https://github.com/beakerandjake/advent-of-code-runner/issues/226))

### Changed
- Replaced inquirer package with @inquirer/prompts, will reduce package size. ([#230](https://github.com/beakerandjake/advent-of-code-runner/issues/230))

### Fixed
- Fix number of solvable problems to be 49 not 50 (day 25 only has one level) ([#224](https://github.com/beakerandjake/advent-of-code-runner/issues/224))

## [1.3.6] - 2023-08-23
### Fixed
- Fix command text in template README file ([#221](https://github.com/beakerandjake/advent-of-code-runner/pull/221))

### Security
- Dependabot bump word-wrap package from 1.2.3 to 1.2.4 ([#220](https://github.com/beakerandjake/advent-of-code-runner/pull/220))

## [1.3.5] - 2023-03-30
### Fixed
- `downloadInput()` no longer trims the end of the text ([#218](https://github.com/beakerandjake/advent-of-code-runner/issues/218))

## [1.3.4] - 2023-02-14
### Fixed
- `downloadInput()` no longer trims the start of the text ([#216](https://github.com/beakerandjake/advent-of-code-runner/issues/216))

## [1.3.3] - 2023-02-09
### Fixed
- Removed WIP warning message on README

## [1.3.2] - 2023-02-09
### Added
- Initial Release

[Unreleased]: https://github.com/beakerandjake/advent-of-code-runner/compare/v1.8.0...HEAD
[1.8.0]: https://github.com/beakerandjake/advent-of-code-runner/compare/v1.7.1...v1.8.0
[1.7.1]: https://github.com/beakerandjake/advent-of-code-runner/compare/v1.7.0...v1.7.1
[1.7.0]: https://github.com/beakerandjake/advent-of-code-runner/compare/v1.6.1...v1.7.0
[1.6.1]: https://github.com/beakerandjake/advent-of-code-runner/compare/v1.6.0...v1.6.1
[1.6.0]: https://github.com/beakerandjake/advent-of-code-runner/compare/v1.5.0...v1.6.0
[1.5.0]: https://github.com/beakerandjake/advent-of-code-runner/compare/v1.4.0...v1.5.0
[1.4.0]: https://github.com/beakerandjake/advent-of-code-runner/compare/v1.3.6...v1.4.0
[1.3.6]: https://github.com/beakerandjake/advent-of-code-runner/compare/v1.3.5...v1.3.6
[1.3.5]: https://github.com/beakerandjake/advent-of-code-runner/compare/v1.3.4...v1.3.5
[1.3.4]: https://github.com/beakerandjake/advent-of-code-runner/compare/v1.3.3...v1.3.4
[1.3.3]: https://github.com/beakerandjake/advent-of-code-runner/compare/v1.3.2...v1.3.3
[1.3.2]: https://github.com/beakerandjake/advent-of-code-runner/releases/tag/v1.3.2
