FROM debian:stretch-slim

RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y \
    wget \
    ca-certificates \
    fontconfig \
    libfreetype6 \
    libjpeg62-turbo \
    libpng16-16 \
    libssl1.1 \
    libx11-6 \
    libxcb1 \
    libxext6 \
    libxrender1 \
    xfonts-75dpi \
    xfonts-base

RUN wget https://downloads.wkhtmltopdf.org/0.12/0.12.5/wkhtmltox_0.12.5-1.stretch_amd64.deb \
    && dpkg -i wkhtmltox_0.12.5-1.stretch_amd64.deb \
    && rm wkhtmltox_0.12.5-1.stretch_amd64.deb \
    && apt-get clean

COPY src/eleventy/assets/fonts/*.ttf /usr/local/share/fonts/
RUN fc-cache -f -v

COPY docker/scripts/buildpdf /usr/bin/buildpdf
ENTRYPOINT [ "/bin/bash", "buildpdf" ]
