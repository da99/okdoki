#!/usr/bin/env bash
# -*- bash -*-
#
set -u
set -e

bin/migrate reset_with_customer
NODE_ENV=development PORT=5000 bin/start
