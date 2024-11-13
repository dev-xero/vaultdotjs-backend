#!/bin/bash

if [ -z "$1" ]; then
  echo "Please provide a flag: --migrate or --format"
  exit 1
fi

# Execute format or migrate commands based on flag
case "$1" in
  --migrate)
    echo "Running prisma migrate..."
    yarn prisma:mgr
    ;;
  --format)
    echo "Running prisma format..."
    yarn prisma:fmt
    ;;
  *)
    echo "Invalid flag. Use --migrate or --format."
    exit 1
    ;;
esac
