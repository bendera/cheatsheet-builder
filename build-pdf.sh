#!/bin/bash

rm -rf dist/pdf
mkdir dist/pdf

IFS='|' read -r -a files <<< $(cat dist/buildparams.txt)

for f in "${files[@]}"
do
  IFS=',' read -r -a finfo <<< $f
  slug="${finfo[0]}"
  orientation="${finfo[1]}"

  echo [wkhtmltopdf] Build dist/cheatsheets/$slug/cheatsheet.pdf

  wkhtmltopdf \
    --log-level warn \
    --orientation $orientation \
    --disable-smart-shrinking \
    --zoom 1 \
    -T 10mm \
    -R 10mm \
    -B 10mm \
    -L 10mm \
    dist/cheatsheets/$slug/index.html dist/pdf/$slug.pdf
done
