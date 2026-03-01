# Security Notes

## Do not commit secrets

Keep credentials only in local env files:

- `.env.local`
- `website/.env.local`

Both are ignored by git via `.gitignore`.

## If secrets were ever exposed

If any API keys/passwords were ever:

- committed to git,
- pasted into docs,
- shared in chat logs,
- or uploaded to a public repo,

assume they are compromised and rotate them immediately.

Typical items to rotate for this project:

- Gmail app password (and/or switch to a transactional email provider)
- Supabase keys (regenerate/revoke as needed)
- `ADMIN_ACCESS_KEY`
- Gemini/Imagen API key

