#!/bin/bash

for i in {events,game,rooms,users}; do
    echo      "$i";
    rm -rf -- "$i/migrations/"*
    touch  -- "$i/migrations/__init__.py"
done
