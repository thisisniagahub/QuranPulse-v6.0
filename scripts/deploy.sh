#!/bin/bash
# QuranPulse Auto-Deploy Script
# This script commits all changes and deploys to Vercel production

echo "🚀 QuranPulse Auto-Deploy"
echo "========================="

# Get commit message from argument or use default
COMMIT_MSG="${1:-Auto-deploy: $(date '+%Y-%m-%d %H:%M')}"

echo "📦 Staging all changes..."
git add -A

echo "📝 Committing: $COMMIT_MSG"
git commit -m "$COMMIT_MSG" || echo "Nothing to commit"

echo "⬆️ Pushing to GitHub..."
git push origin main

echo "🔨 Building & Deploying to Vercel..."
npx vercel --prod --yes

echo ""
echo "✅ DONE! Check https://quranpulse.my"
