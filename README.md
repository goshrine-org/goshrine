# Goshrine

This project is a reimplementation of the now defunct goshrine.com website,
available at: https://goshrine.org

The goshrine.com website was a lightweight web based server for playing the
board game go.  It existed from around 2009, the backend broke around 2015, and
the website itself completely disappeared in 2021.

This project is based on black-box reverse engineering of the original site,
and reimplements it using django and channels.  Although it aims to maintain
compatibility, several incompatible improvements that address design issues in
the original project have been made, and it is likely this project will diverge
further from the original website in the future.

The source code of this project has been made available for all, as the main
purpose was preservation.

## Getting Started

These instructions will get you a copy of the project up and running on your
local machine for development and testing purposes.

### Installation

Install the following packages on ubuntu using `sudo apt-get install`.

```
postgresql-contrib
python3-dev
redis
libpq-dev
```

Create a venv using `python3 -m venv .venv` and activate it using
`source .venv/bin/activate`.

Install all pip packages using `pip install -r requirements.txt`.

### Initializing the Database

Upon installing PostgreSQL, the account "postgres" will have been created on
your machine. Switch to this account using `sudo su postgres`.  Run PostgreSql
using `psql`

Run the following to create user and database.
```
create user goshrine with password 'goshrine';
create database goshrine with encoding 'utf-8';
grant all privileges on database goshrine to goshrine;
\c goshrine
create extension citext;
```

Return back to your normal account on your machine and run the following to
make migrations.
```
python manage.py makemigrations
python manage.py migrate
```

### Running the Test Server

To run the site, you will first need an admin account for the server.

```
python manage.py createsuperuser
```

Next, navigate to `goshrine/settings.py` and set `DEBUG = True`.

Finally, run `python manage.py runserver localhost:8000`.

Navigate to `localhost:8000/admin` to create Goshrine room and user.


## Deployment

Add additional notes about how to deploy this on a live system
