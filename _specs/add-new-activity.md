# Spec for add-new-activity

branch: feature/add-new-activity

## Summary

- Allow authenticated users to create new activities
- Create button in Nav component that opens DialogActivityAddOrEdit modal
- New activity persisted via Cloud Function

## Functional Requirements

- Add a "Create" icon button in the Nav component (right side, before login/logout)
- Button only visible to authenticated users (isAuth === true)
- Clicking opens DialogActivityAddOrEdit dialog (in "add" mode - no activity prop)
- Dialog collects: name, type, total (optional), cycle (optional)
- On submit, create new activity via new Cloud Function `activityAdd`
- Activity created with user's uid and default count (current=0 or left=cycle)
- Success closes dialog and shows toast notification
- Error shows toast notification

## Figma Design

- No Figma reference provided
- Use existing IconButton pattern from Nav component
- Use plus/add icon (e.g., TbPlus from react-icons/tb)

## Possible Edge-Cases

- User tries to create while offline
  > disable button/during mutation, show error toast
- Cloud Function fails (validation, server error)
  > show error toast, keep dialog open with entered values
- User closes dialog without saving
  > Act as cancel, no data loss
- Duplicate activity names
  > allow duplicates (no uniqueness constraint)

## Acceptance Criteria

- [ ] Nav component shows Create button for authenticated users only
- [ ] Create button is an IconButton with plus/add icon
- [ ] Clicking button opens DialogActivityAddOrEdit in add mode
- [ ] Dialog form validates: name required, type required, total/cycle optional positive numbers
- [ ] Submit creates activity via activityAdd Cloud Function
- [ ] New activity appears in list after successful creation
- [ ] Success toast shows "Activity added"
- [ ] Error toast shows on failure
- [ ] Button disabled during mutation

## Open Questions

- Should new activities default to "current" mode (counting up) or "left" mode (counting down)?
  > None, both are `undefined` initially, but only one can be set at a time
- What should the default activity type be?
  > First type in list: "climbing"
- Should the dialog close on success or stay open for rapid entry?
  > Close on success (consistent with edit dialog)

## Testing Guidelines

Create test file(s) in ./react/test folder for the new feature with meaningful tests for the following cases:

- Create button visible only for authenticated users
- Clicking Create button opens DialogActivityAddOrEdit
- Dialog submission calls activityAdd mutation with correct params
- Successful creation adds activity to list
- Error toast displays on mutation failure
- Form validation works (name required, type required)
- Optional fields (total, cycle) can be omitted
