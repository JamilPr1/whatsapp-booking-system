# GitHub Authentication Guide

## Option 1: GitHub Desktop (Easiest)

1. Download [GitHub Desktop](https://desktop.github.com/)
2. Sign in with your GitHub account
3. File → Clone Repository → URL
4. Enter: `https://github.com/furqansaadat855-code/whatsapp-booking-system.git`
5. Click "Clone"
6. Make changes, commit, and push from GitHub Desktop

## Option 2: Personal Access Token (Recommended for CLI)

### Step 1: Create Personal Access Token

1. Go to GitHub.com → Settings → Developer settings
2. Click "Personal access tokens" → "Tokens (classic)"
3. Click "Generate new token" → "Generate new token (classic)"
4. Name: `Vercel Deployment`
5. Select scopes:
   - ✅ `repo` (Full control of private repositories)
6. Click "Generate token"
7. **COPY THE TOKEN** (you won't see it again!)

### Step 2: Use Token to Push

```bash
cd "C:\Users\Iamja\Desktop\Whatsapp Project"
git push https://YOUR_TOKEN@github.com/furqansaadat855-code/whatsapp-booking-system.git main
```

Replace `YOUR_TOKEN` with your actual token.

## Option 3: GitHub CLI

```bash
# Install GitHub CLI
winget install GitHub.cli

# Authenticate
gh auth login

# Follow the prompts to authenticate in browser
# Then push
git push -u origin main
```

## Option 4: SSH Key (Most Secure)

1. Generate SSH key:
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

2. Add to GitHub:
   - Copy `~/.ssh/id_ed25519.pub`
   - GitHub → Settings → SSH and GPG keys → New SSH key
   - Paste and save

3. Update remote:
```bash
git remote set-url origin git@github.com:furqansaadat855-code/whatsapp-booking-system.git
git push -u origin main
```

## Quick Push (Using Token)

If you have a token, run:
```bash
cd "C:\Users\Iamja\Desktop\Whatsapp Project"
git push https://YOUR_TOKEN@github.com/furqansaadat855-code/whatsapp-booking-system.git main
```
