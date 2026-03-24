# Plan: Activity Editing via Long Press

## Context

Allow authenticated users to edit activity properties (name, type, total, cycle, current, left) directly from the list via a long-press gesture. Currently, users can only increment/decrement/reset activities - there's no way to modify activity properties after creation.

## Implementation Approach

### 1. Use the `useLongPress` hook from `react-use`

### 2. Create `DialogActivityAddOrEdit` Component

**New file:** `react/src/components/DialogActivityAddOrEdit.tsx`

Following the `DialogLogin.tsx` pattern:

- Chakra UI Modal components (Modal, ModalOverlay, ModalContent, etc.)
- Zod validation for inputs
- `useSetState` for form state
- Props: `{ open: boolean, onClose: () => void, activity?: Activity }`

Editable fields:

- `name` - text input (1-50 chars, Zod validation)
- `type` - select dropdown with emoji icons (🧗 climbing, 🏇 horse-riding, 💃 dance, 🥷 karate, 🏊‍♀️ swimming, 🎵 music)
- `total` - number input, optional, positive values only
- `cycle` - number input, optional, positive values only

In this case the `DialogActivityAddOrEdit` will be used to edit existing Activity, but later same dialog could be used for creating a new one

### 3. Create Edit Mutation

**Modify:** `react/src/cache/activities.ts`

Add `useActivityUpdate()` mutation following existing pattern:

```typescript
const activityUpdateFn = firebase.httpsCallable("activityUpdate");

export function useActivityUpdate() {
  const mutation = useMutation({
    mutationFn: async (params: { id: string; updates: Partial<Activity> }) => {
      await activityUpdateFn(params).then(r => r.data);
    },
    meta: { action: ["Activity", "Update"] },
  });
  return mutation.mutateAsync;
}
```

### 4. Create Cloud Function `activityUpdate`

**Modify:** `functions/index.js`

Add a new callable function that updates activity fields (authorizes via `context.auth`).

### 5. Update `Activities` Component

**Modify:** `react/src/components/Activities.tsx`

- Add state for edit dialog: `const [editingActivity, setEditingActivity] = useState<Activity | null>(null)`
- Wrap activity name `<Text>` with long-press handlers
- Add visual feedback (opacity/color change) during press
- Conditionally render `DialogActivityAddOrEdit` when `editingActivity` is set

### 6. Add Toast Notification Handling

**Verify:** `react/src/cache/index.tsx` already handles mutation meta for toasts (it does)

## Critical Files

| File | Action |
| ---- | ------ |
| `react/src/components/DialogActivityAddOrEdit.tsx` | Create |
| `react/src/cache/activities.ts` | Add `useActivityUpdate()` |
| `functions/index.js` | Add `activityUpdate` callable |
| `react/src/components/Activities.tsx` | Add long-press + dialog |

## Verification

1. Test long-press (500ms) on activity name opens dialog
2. Verify non-auth users cannot trigger edit
3. Edit name (1-50 chars), type with emoji, total/cycle (positive) - save successfully
4. Verify toast shows on success/error
5. Confirm activity list updates after save
6. Test cancel closes without changes
7. Test validation: empty name, negative numbers show errors
8. Test on both mobile (touch) and desktop (mouse long-press)
