#!/bin/bash

docker run --rm -v "$(pwd)":/workdir -u `id -u $USER` cheatsheet_builder_wkhtmltox
