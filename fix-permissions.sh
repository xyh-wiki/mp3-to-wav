#!/usr/bin/env bash
# Author: XYH
# Date: 2025-11-19
# Description: macOS / Linux 下修复 node_modules/.bin 权限问题的脚本

set -e

echo "Fixing execute permissions for node_modules/.bin ..."
if [ -d "node_modules/.bin" ]; then
  chmod -R +x node_modules/.bin || true
  echo "Done. You can now run: npm run dev"
else
  echo "node_modules directory not found. Please run 'npm install' first."
fi
