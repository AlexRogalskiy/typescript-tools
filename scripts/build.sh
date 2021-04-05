#!/bin/bash

# This runs quicktype, ensuring dependencies are installed
# and rebuilding quicktype first.
#
# Use script/quickertype to skip reinstalling dependencies
# and rebuilding PureScript for 10s faster runs if you
# are just working on TargetLanguage code in TypeScript.

SCRIPTDIR=$(dirname "$0")
BASEDIR="$SCRIPTDIR/.."

if [ x"$SKIP_BUILD" = x ] ; then
    ( cd "$BASEDIR" ; npm run build &>/dev/null )
fi
node --stack_trace_limit=100 --max-old-space-size=4096 "$BASEDIR/dist/cli/index.js" "$@"
