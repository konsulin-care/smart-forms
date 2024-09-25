# Change log

This log documents significant changes for the [@aehrc/smart-forms-renderer](https://www.npmjs.com/package/@aehrc/smart-forms-renderer). This project follows
[Semantic Versioning](http://semver.org/).

Changelog only includes changes from version 0.36.0 onwards.

## [0.41.0] - 2024-09-25
### Changed
- Significantly improved performance by reducing the number of re-renders.
- Adjusted renderer's background color to be #fafafa.
- Removed left and right paddings from the renderer - it now takes up the full width of its container.

### Fixed
- Fixed inconsistencies when syncing the renderer's internal state with externally-generated QuestionnaireResponses.
- Fixed inconsistencies with internal IDs for tracking repeating items and groups.
- Fixed an issue where the renderer's theme was overriding the parent app's styles.
- Fixed issues with lodash dependencies in package.json.

### Added
- Added a library function removeInternalIdsFromResponse() to remove internal IDs for tracking repeating items.


## [0.40.1] - 2024-09-18
### Fixed
- Fix date validation error message for two matches.
- Fix generation of internal IDs for repeat items and groups to be consistent and sync-able with externally-generated QuestionnaireResponses.
- Added a simple, minimal fix to dynamically adjust field positions based on viewport

## [0.40.0] - 2024-09-06
### Added
- Added support for Observation-based extraction as a library function and as a feature in the Playground.

## [0.39.0] - 2024-09-06
### Changed
- Refactored `repeat` items so that it tracks item instances using the QuestionnaireResponse, instead of using React's `useState`.

### Fixed
- Fixed an issue where `string` and `text` items were automatically removing inputted trailing whitespaces.

## [0.38.4] - 2024-08-29
### Fixed
- Fixed support for item.initial and item.answerOption.initialSelected for repeating groups.

## [0.38.3] - 2024-08-23
### Added
- Added support for non-repeating group table (`gtable`) items.

## [0.38.2] - 2024-08-21
### Added
- Added support for `Quantity` items. See documentation and Storybook for more details.

## [0.37.2] - 2024-08-19
### Fixed
- Fixed a @aehrc/sdc-populate library dependency issue.

## [0.37.1] - 2024-08-05
### Added
- Added support for `page` UI Control code from https://hl7.org/fhir/extensions/ValueSet-questionnaire-item-control.html.

## [0.36.1] - 2024-07-23
### Added
- Add support for `Coding` type in calculatedExpressions for choice and open-choice items.

## [0.36.0] - 2024-07-22
### Added
- Add Save-Extract-Write functionality (StructureMap-based) in the "Save as Final" button in the Smart Forms app.