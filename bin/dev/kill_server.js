#!/usr/bin/env bash
# -*- bash -*-
#
echo ""
echo "Sending SIGTERM to server..."
pkill -f "lib/app.js 5001"
exit 0