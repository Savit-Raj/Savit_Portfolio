# Setting up this project on a new computer

The steps below take you from a `.zip` file to the site running at **http://localhost:5173**. They work on Windows, macOS and Linux.

**Quick version:** install Node.js 22 LTS or newer, unzip, open a terminal in the folder, then run:

```bash
npm ci
npm run dev
```

The rest of this guide covers each step and what to do if one fails.

---

## Step 0 — Zip it correctly (on the old computer)

**Do not include `node_modules/` in the zip.**

- It's about 170 MB, versus about 270 KB for the project itself.
- It contains programs compiled for the old computer's operating system. The bundler, Tailwind and the linter all ship native binaries, so a Windows copy won't run on a Mac, and vice versa.
- `npm ci` rebuilds it for the new machine in about a minute.

Also leave out:

- `dist/`: build output that gets regenerated.
- `.env.local`: holds your form key; re-create it on the new machine instead.
- `Savit_SDE_Resume.pdf`: contains your phone number and date of birth.

**Windows (PowerShell).** Run this from the folder that *contains* `Savit_Portfolio`:

```powershell
cd C:\Users\<you>\Downloads
tar.exe -a -c -f Savit_Portfolio.zip --exclude=node_modules --exclude=dist --exclude=.env.local --exclude=Savit_SDE_Resume.pdf Savit_Portfolio
```

**macOS / Linux:**

```bash
cd ~/Downloads
zip -r Savit_Portfolio.zip Savit_Portfolio -x "*/node_modules/*" "*/dist/*" "*/.env.local" "*/Savit_SDE_Resume.pdf"
```

The resulting zip should be well under 1 MB. If it's hundreds of MB, `node_modules` slipped in.

> Zipping by right-click → "Send to → Compressed folder" also works, but delete `node_modules` first. You can always get it back with `npm ci`.

---

## Step 1 — Install Node.js (on the new computer)

This project needs **Node.js 20.19+ or 22.12+**. Vite 8 won't start on anything older.

1. Download the **LTS** installer from **https://nodejs.org** and install it with the defaults. npm comes bundled with it.
2. **Close and reopen** your terminal so it picks up the new install.
3. Check the versions:

   ```bash
   node -v    # should print v22.x or newer (v20.19+ also works)
   npm -v     # should print 10.x or newer
   ```

<details>
<summary>Already have an older Node for other projects? Use a version manager instead</summary>

- **Windows:** [nvm-windows](https://github.com/coreybutler/nvm-windows) → `nvm install lts` then `nvm use lts`
- **macOS / Linux:** [nvm](https://github.com/nvm-sh/nvm) → `nvm install --lts` then `nvm use --lts`

</details>

---

## Step 2 — Unzip and open a terminal in the project

1. Unzip `Savit_Portfolio.zip` anywhere, for example your Desktop or `Documents/projects`.
   Avoid OneDrive/iCloud-synced folders if you can, because syncing thousands of `node_modules` files slows everything down.
2. Open a terminal **inside** the `Savit_Portfolio` folder (the one containing `package.json`):
   - **VS Code (easiest on any OS):** File → Open Folder → `Savit_Portfolio`, then Terminal → New Terminal.
   - **Windows:** open the folder in File Explorer, type `powershell` in the address bar, and press Enter.
   - **macOS:** right-click the folder in Finder → *New Terminal at Folder*.
3. Confirm you're in the right place:

   ```bash
   ls          # macOS/Linux/PowerShell — you should see package.json, src, public …
   ```

---

## Step 3 — Install dependencies

```bash
npm ci
```

`npm ci` installs the **exact** versions recorded in `package-lock.json`, so the new machine gets the same versions that were tested. It takes about 30–90 seconds. The final line should mention `added … packages`. A few `npm warn` lines are normal.

> Use `npm install` only if `npm ci` complains that the lock file is out of sync.

---

## Step 4 — Run it

```bash
npm run dev
```

The terminal will print:

```
  VITE v8.x  ready in 400 ms
  ➜  Local:   http://localhost:5173/
```

Open **http://localhost:5173** in Chrome, Edge, Firefox or Safari.

- Edit files in `src/`. The browser updates instantly, with no restart needed.
- To stop the server, press **`Ctrl + C`** in the terminal.

### Other useful commands

| Command | What it does |
| --- | --- |
| `npm run dev -- --host` | Also serves on your Wi-Fi IP so you can open the site on your phone (use the `Network:` URL it prints) |
| `npm run build` | Type-checks and builds the production site into `dist/` (this is what Vercel runs) |
| `npm run preview` | Serves that production build at http://localhost:4173 |
| `npm run lint` | Runs the linter |

Run `npm run build` once before deploying. If it passes locally, it will pass on Vercel.

---

## Step 5 (optional) — Restore local-only extras

These files were deliberately left out of the zip.

- **Contact form:** works with no setup. It delivers through FormSubmit, which needs a one-time activation: submit the
  form once yourself and click the "Activate Form" link it emails you. Your `.env.local` (if you created one with
  `VITE_FORMSUBMIT_ID` or `VITE_WEB3FORMS_ACCESS_KEY`) wasn't zipped, so copy `.env.example` to `.env.local` and
  re-enter it, then restart `npm run dev`. See *Contact form* in `README.md`.
- **Demo videos:** if you added clips to `public/media/`, they're inside the zip already. Nothing to do.
- **Recommended VS Code extension:** *Tailwind CSS IntelliSense* (`bradlc.vscode-tailwindcss`), for class autocompletion.

---

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `node` / `npm` is not recognized / command not found | Node isn't installed, or the terminal was open during install. Install it (Step 1), then **close and reopen** the terminal. |
| `Vite requires Node.js version 20.19+ or 22.12+` | Your Node is too old. Install the current LTS (Step 1) and check `node -v`. |
| PowerShell: *running scripts is disabled on this system* | Run once: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`. Or use **Command Prompt** instead. |
| `Cannot find module '@rolldown/binding-…'` or `'@tailwindcss/oxide-…'` | `node_modules` was copied from another OS. Delete it and reinstall: `rm -rf node_modules` (PowerShell: `Remove-Item -Recurse -Force node_modules`), then `npm ci`. |
| `npm ci` fails with `ETIMEDOUT`, `ECONNRESET`, `SELF_SIGNED_CERT_IN_CHAIN` | Usually a **corporate network / VPN / proxy** (common on office laptops). Try a personal network, or configure the proxy: `npm config set proxy http://<proxy>:<port>` and `npm config set https-proxy http://<proxy>:<port>`. Ask IT for the values. |
| `EACCES: permission denied` (macOS/Linux) | Don't use `sudo npm …`. Install Node via nvm (Step 1) so npm owns its folders. |
| Windows: `EBUSY: resource busy or locked, rename '…node_modules\.vite\deps_temp_…'` | Antivirus (Windows Defender) was scanning Vite's freshly written cache while Vite tried to rename it. The site usually still works, but the cache isn't saved. Stop the server (`Ctrl + C`), then run `npm run dev:clean` once: it clears `node_modules/.vite` and restarts. Later starts reuse the saved cache and won't hit this. If it keeps recurring, ask IT about a Defender exclusion for your projects folder. This doesn't happen on macOS. |
| `Port 5173 is in use` | Vite automatically tries 5174, 5175… Use whatever URL the terminal prints, or free the port by closing the other dev server. |
| Page is blank | Open DevTools (`F12`) → **Console** and read the red error. Most often `npm ci` didn't finish, so re-run it. |
| Fonts look like Arial / Times | Dependencies are missing (fonts are installed via npm). Run `npm ci`. |
| Animations don't play | Your OS has *reduce motion* turned on, and the site respects it on purpose. On Windows: Settings → Accessibility → Visual effects → **Animation effects**. On macOS: System Settings → Accessibility → Display → **Reduce motion**. |
| Still stuck | Delete `node_modules` (and `package-lock.json` **only as a last resort**), then run `npm install` again. |

---

## What's next

- **Edit content:** everything you'd normally change is in `src/data/` and `src/config/site.ts`. See the *Common edits* table in `README.md`.
- **Deploy:** push the folder to GitHub, then import it on Vercel. Step-by-step instructions are under *Deploying to Vercel* in `README.md`. `.gitignore` already keeps `node_modules`, `dist`, `.env*` and the résumé PDF out of the repo.
