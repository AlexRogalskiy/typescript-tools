#!/bin/bash
### Example of a dev-version-bumping script for a Python project
### Located at: ./scripts/post-release.sh
set -eux
OLD_VERSION="${1}"
NEW_VERSION="${2}"

# Ensure master branch
git checkout master
# Advance the CalVer release by one-month and add the `.dev0` suffix
./scripts/bump-version.sh '' $(date -d "$(echo $NEW_VERSION | sed -e 's/^\([0-9]\{2\}\)\.\([0-9]\{1,2\}\)\.[0-9]\+$/20\1-\2-1/') 1 month" +%y.%-m.0.dev0)
# Only commit if there are changes, make sure to `pull --rebase` before pushing to avoid conflicts
git diff --quiet || git commit -anm 'meta: Bump new development version' && git pull --rebase && git push
