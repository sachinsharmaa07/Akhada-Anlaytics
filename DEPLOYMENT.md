# 🚀 Akhada Analytics — EC2 Deployment Guide

> Deploy the full stack on AWS EC2 with automatic CI/CD.

---

## How It Works

```
git push main → GitHub Actions → Build Docker images → Push to Docker Hub → SSH into EC2 → Pull & Restart
```

Every push to `main` auto-deploys. No manual steps after initial setup.

---

## Setup Status

- [x] Docker Hub account: `sachinsharmaa07`
- [x] EC2 instance launched (Ubuntu 24.04)
- [x] Elastic IP: `13.127.145.141`
- [x] PEM key: `akhada-key.pem`
- [x] Docker installed on EC2
- [x] App directory created: `/opt/akhada-analytics`
- [x] Production `.env` configured on EC2
- [ ] **GitHub Secrets (8 total) — DO THIS NEXT**
- [ ] Push code to trigger first deploy

---

## Next Step — Add GitHub Secrets

Go to your GitHub repo → **Settings → Secrets and variables → Actions → New repository secret**

Add these **8 secrets** one by one:

| # | Secret Name | Value |
|---|-------------|-------|
| 1 | `DOCKERHUB_USERNAME` | `sachinsharmaa07` |
| 2 | `DOCKERHUB_TOKEN` | *(your Docker Hub access token)* |
| 3 | `EC2_HOST` | `13.127.145.141` |
| 4 | `EC2_USER` | `ubuntu` |
| 5 | `EC2_SSH_KEY` | *(full content of akhada-key.pem — see below)* |
| 6 | `EC2_APP_DIR` | `/opt/akhada-analytics` |
| 7 | `REACT_APP_API_URL` | `http://13.127.145.141/api` |
| 8 | `REACT_APP_GOOGLE_CLIENT_ID` | `1004581803165-4dq1ee0aeq27cgj7g3pml3ipjojmt6sd.apps.googleusercontent.com` |

### For `EC2_SSH_KEY`:

Run this on your Mac terminal:
```bash
cat "/Users/sachinsharma/Downloads/Daily/Projects/Akhada Analytics AWS/akhada-key.pem"
```
Copy the **entire output** (including `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----` lines) and paste as the secret value.

---

## After GitHub Secrets — Deploy!

```bash
cd "/Users/sachinsharma/Downloads/Daily/Projects/Akhada Analytics AWS"
git add -A
git commit -m "feat: CI/CD pipeline with Docker Hub and EC2 deploy"
git push origin main
```

Then go to **GitHub → Actions** tab and watch the 3 stages go green (~5-8 min first time).

### Verify:

```
http://13.127.145.141              → React app
http://13.127.145.141/api/health   → {"status":"ok"}
```

---

## Google OAuth Update (if using Google Sign-In)

1. Go to [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials
2. Click your OAuth Client ID
3. Add to **Authorized JavaScript origins**: `http://13.127.145.141`
4. Add to **Authorized redirect URIs**: `http://13.127.145.141`
5. Save

---

## Troubleshooting

SSH into EC2 and check:
```bash
ssh -i "/Users/sachinsharma/Downloads/Daily/Projects/Akhada Analytics AWS/akhada-key.pem" ubuntu@13.127.145.141
cd /opt/akhada-analytics
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f
```

| Problem | Fix |
|---------|-----|
| **502 Bad Gateway** | Wait 30s and refresh. Or: `docker compose -f docker-compose.prod.yml restart backend` |
| **Site doesn't load** | Check AWS Security Group has port 80 open |
| **GitHub Action SSH fails** | Re-check `EC2_SSH_KEY` has full `.pem` content |
| **MongoDB error** | `docker compose -f docker-compose.prod.yml restart` |
| **Disk full** | `docker system prune -af` |

## Useful Commands (on EC2)

```bash
cd /opt/akhada-analytics

docker compose -f docker-compose.prod.yml ps           # status
docker compose -f docker-compose.prod.yml logs -f      # live logs
docker compose -f docker-compose.prod.yml restart      # restart all
docker compose -f docker-compose.prod.yml down         # stop all
docker compose -f docker-compose.prod.yml up -d        # start all
docker system prune -f                                 # cleanup
```
