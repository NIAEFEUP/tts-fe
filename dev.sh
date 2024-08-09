#!/bin/bash
set -e # abort script if any command fails

docker compose up $1 tts-frontend
