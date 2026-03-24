# Spec for activity-editing-via-long-press

branch: feature/activity-editing-via-long-press

## Summary

- Allow authenticated users to edit existing activities directly from the activities list
- Editing is triggered by long-pressing on the activity name/text in the list item
- Opens a modal/dialog with editable fields for the activity

## Functional Requirements

- Long-press (typically 500ms+) on the activity name text opens an edit dialog
- Edit dialog is only available to authenticated users (same gate as increment/reset buttons)
- Dialog allows editing of: name, total, cycle, type (via dropdown selector)
- Activity type determines the icon shown (climbing, horse-riding, dance, karate, swimming, music)
- Save button commits changes to Firestore via a dedicated Cloud Function
- Cancel button closes dialog without saving
- Dialog shows current values pre-populated

## Figma Design

- No Figma reference provided

## Possible Edge-Cases

- Long-press may conflict with mobile browser context menus
  > needs preventDefault handling
- What happens if activity is edited while another user is viewing it (optimistic updates vs stale data)
- Network failures during save
  > should show error toast and keep dialog open with entered values
- User tries to leave page with unsaved edits in dialog
  > Act as cancel
- Editing total/cycle for activities with "left" count vs "current" count (discriminated union type)
  > allow editing of "left"/"current" if they are defined already

## Acceptance Criteria

- [ ] Long-press on activity name opens edit dialog for authenticated users
- [ ] Non-authenticated users cannot trigger edit dialog
- [ ] Dialog displays all editable fields with current values
- [ ] Type selector shows available activity types with their emoji icons
- [ ] Save button persists changes and closes dialog
- [ ] Cancel button closes dialog without changes
- [ ] Error handling shows toast notification on save failure
- [ ] Activity list updates with new values after successful save
- [ ] Long-press uses appropriate duration (500ms+) and provides visual feedback

## Open Questions

- Should the activity ID be editable? (Likely no - it's the primary key) -> No
- Should user be able to switch between "current" and "left" count types? (This changes the discriminated union) -> No
- What validation rules apply to fields (min/max for totals, name length)? -> No validations needed
- Should there be a confirmation before saving or immediate save? -> Immediate save

## Testing Guidelines

Create test file(s) in ./react/test folder for the new feature with meaningful tests for the following cases:

- Long-press gesture triggers edit dialog for authenticated user
- Long-press does NOT trigger dialog for non-authenticated user
- Save button persists edited values to Firestore
- Cancel button closes dialog without persisting
- Type selector updates activity icon
- Error toast displays on network/save failure
- Dialog pre-populates with current activity values
