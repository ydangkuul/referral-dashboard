# Invite CTA copy update

## Goal

Change the primary CTA label on the intro flow's invite screen from `Invite people now` to `Next`.

## Scope

- Update only the visible button label in `InviteScreen`.
- Preserve the existing `UserPlus` icon, button styling, and `onNext` behavior.
- Do not change any other invite or sharing copy.

## Verification

- Confirm the old CTA text no longer appears in the source.
- Run the existing automated tests and production build.
- Confirm the invite screen renders the `Next` label without changing navigation behavior.
