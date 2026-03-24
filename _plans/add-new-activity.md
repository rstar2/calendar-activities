# Plan: Add New Activity

## Context

Users can currently view and increment/decrement existing activities, but there's no way to create new activities through the UI. This feature adds a "Create" button to the Nav bar that opens a dialog for authenticated users to add new activities.

## Implementation Approach

### 1. Create Cloud Function `activityAdd`

**Modify:** `functions/index.js`

Add new callable function following existing patterns:

```javascript
exports.activityAdd = functions.https.onCall(async (data, context) => {
  checkAuthorized(context);

  const { name, type, total, cycle } = data;

  // Validate required fields
  if (!name || !type) {
    throw new functions.https.HttpsError("invalid-argument", "Name and type are required");
  }

  // Create new activity with user's uid
  const docRef = await activities.add({
    name,
    type,
    user: context.auth.uid,
    total: total || undefined,
    cycle: cycle || undefined,
    current: 0,
  });

  return { id: docRef.id };
});
```

### 2. Create Add Activity Mutation

**Modify:** `react/src/cache/activities.ts`

Add `useActivityAdd()` mutation following existing pattern:

```typescript
const activityAddFn = firebase.httpsCallable("activityAdd");

export function useActivityAdd() {
  const mutation = useMutation({
    mutationFn: async (activity: Partial<Activity>) => {
      await activityAddFn(activity).then(r => r.data);
    },
    meta: { action: ["Activity", "Added"] },
  });
  return [mutation.mutateAsync, mutation.isPending] as const;
}
```

### 3. Update Nav Component

**Modify:** `react/src/components/Nav.tsx`

- Import `TbPlus` icon from `react-icons/tb`
- Import `DialogActivityAddOrEdit`
- Import `useActivityAdd` from `../cache/activities`
- Add state: `const [isAddDialogOpen, setAddDialogOpen] = useState(false)`
- Add Create button (before login/logout, only when `isAuth`):

  ```tsx
  {isAuth && (
    <TooltipMobile label="Add activity">
      <IconButton
        variant="ghost"
        isRound
        onClick={() => setAddDialogOpen(true)}
        icon={<TbPlus />}
        aria-label="add activity"
      />
    </TooltipMobile>
  )}
  ```

- Render dialog:

  ```tsx
  <DialogActivityAddOrEdit
    open={isAddDialogOpen}
    disabled={isAddPending}
    onClose={(value) => {
      setAddDialogOpen(false);
      if (value) activityAdd(value);
    }}
  />
  ```

## Critical Files

| File | Action |
| ---- | ------ |
| `functions/index.js` | Add `activityAdd` callable |
| `react/src/cache/activities.ts` | Add `useActivityAdd()` |
| `react/src/components/Nav.tsx` | Add Create button + dialog |

## Verification

1. Create button only visible when authenticated
2. Clicking opens dialog with empty form
3. Fill name, select type, optional total/cycle - submit creates activity
4. New activity appears in list immediately (Firestore sync)
5. Success toast shows "Activity added"
6. Error toast shows on validation/network failure
7. Dialog closes on success, stays open on error with entered values
8. Button disabled during mutation
