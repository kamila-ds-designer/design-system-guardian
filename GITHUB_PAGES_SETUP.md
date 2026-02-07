# Publish with GitHub Pages

## Step 1: Create the repository on GitHub

1. Go to [github.com/new](https://github.com/new)
2. Name it `design-system-guardian` (or any name you prefer)
3. Leave it **empty** (no README, no .gitignore)
4. Click **Create repository**

## Step 2: Connect and push

Replace `YOUR_USERNAME` with your GitHub username, then run:

```bash
cd "/Users/kamila/Documents/Hackathon /design-system-guardian"
git remote add origin https://github.com/YOUR_USERNAME/design-system-guardian.git
git push -u origin main
```

If prompted for credentials, use a Personal Access Token (not your password).

## Step 3: Enable GitHub Pages

1. Open your repo on GitHub
2. Go to **Settings** → **Pages**
3. Under **Build and deployment**:
   - **Source**: Deploy from a branch
   - **Branch**: `main` / `/(root)`
4. Click **Save**

## Step 4: Wait and view

GitHub will deploy in 1–2 minutes. Your site will be at:

```
https://YOUR_USERNAME.github.io/design-system-guardian/
```

(If you used a different repo name, replace `design-system-guardian` in the URL.)
