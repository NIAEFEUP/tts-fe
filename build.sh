#!/usr/bin/env bash

case "$1" in
"dev")
  docker compose build tts-frontend $2
  ;;
"prod")
  docker compose build tts-frontend-prod $2
  ;;
esac
