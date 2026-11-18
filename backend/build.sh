#!/usr/bin/env bash
set -o errexit

python -m pip install --upgrade pip setuptools wheel
python -m pip install --pre -r requirements.txt
python manage.py migrate --noinput
python manage.py collectstatic --noinput