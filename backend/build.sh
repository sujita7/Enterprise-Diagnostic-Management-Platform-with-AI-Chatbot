#!/usr/bin/env bash
# exit on error
set -o errexit

pip install -r requirements.txt

python manage.py collectstatic --noinput
python manage.py migrate

# Note: If you want to seed the database on every deploy (not recommended for production), 
# you could run the seed scripts here. Usually, you only run them once manually.
