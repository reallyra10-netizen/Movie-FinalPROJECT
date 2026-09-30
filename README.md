This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Team Setup

After cloning the project, install all packages:

```powershell
npm.cmd install
```

Make a local environment file from the example:

```powershell
Copy-Item .env.example .env
```

Ask a team member for the real Google OAuth values and put them only in `.env`.
Do not commit the real secret values to GitHub.

Create the local SQLite database from our shared migration:

```powershell
npx.cmd prisma migrate deploy
npx.cmd prisma generate
```

Start the development server:

```powershell
npm.cmd run dev
```

Open [http://localhost:3000](http://localhost:3000) in the browser.

## Demo Flow

1. Create an account on `/signup`.
2. Login with email and password on `/login`.
3. Test Google Login from the same page.
4. Check registered demo users on `/dashboard/users`.

The local `prisma/dev.db` file is not shared because it may contain account data.
Every team member gets the same tables by running the migration command above.
