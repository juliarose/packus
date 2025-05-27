## [1.0.3] - 2021-03-20
### Changed
- Script files can now use async and arrow functions.

## [1.0.5] - 2025-05-27
### Fixed
- Configure Git to use CRLF line endings via .gitattributes
- Normalize file reading to LF internally, then output final files (.user.js, .meta.js) with CRLF line endings
- Use Node.js path utilities instead of a regex which doesn't work on a Windows path.