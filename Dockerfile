FROM node:22-bookworm

ENV DEBIAN_FRONTEND=noninteractive

WORKDIR /app

# Install font dependencies, LibreOffice, dan download Courier New
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    fontconfig \
    wget \
    cabextract \
    xfonts-utils \
    libreoffice && \
    mkdir -p /usr/share/fonts/truetype/custom && \
    fc-cache -f -v && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Tambahkan font custom seperti Calibri, Bernard, Bodoni (harus legal dan disertakan dalam folder fonts/)
COPY src/fonts/ /usr/share/fonts/truetype/custom/
RUN fc-cache -f -v

# Node dependencies
COPY package*.json ./
RUN npm ci

# Process manager for cluster mode
RUN npm install -g pm2

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["pm2-runtime", "start", "dist/server.js", "-i", "max"]

