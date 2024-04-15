# syntax=docker/dockerfile:1

# letöltjük a futtatási környezetet
FROM oven/bun:1 AS base

# alapértelmezett munka könyvtár meghatározása
WORKDIR /usr/src/app

FROM base AS deps

# létrehozunk egy átmeneti mappát a node_modules-nak
RUN mkdir -p /temp/prod
# felmásoljuk a helyi gépről a package.json és lock fájlt
COPY package.json bun.lockb /temp/prod/
# belépünk a mappába és letöltjük a függőségeket
RUN cd /temp/prod && bun install --frozen-lockfile

FROM deps AS build

# a deps stage-ből átmásoljuk a node_modules mappát
COPY --from=deps /temp/prod/node_modules node_modules
# a helyi gépről felmásoljuk a forráskódot
COPY . .

# legeneráljuk a prisma sémát
RUN bunx prisma generate

# buildeljük a next applikációt
RUN bun run build

FROM base AS release

# beállítjuk az env-et production-re
ENV NODE_ENV=production

# felmásoljuk a seed fájlt a helyi gépről
COPY db/seed.ts ./db/

# a deps stage-ből átmásoljuk a package.json-t a képfájlba
COPY --chown=bun --from=deps /temp/prod/package.json ./package.json

# a build stage-ből átmásoljuk a szükséges mappákat a képfájlba
COPY --chown=bun --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=bun --from=build /usr/src/app/public ./public
COPY --chown=bun --from=build /usr/src/app/prisma ./prisma
COPY --chown=bun --from=build /usr/src/app/.next ./.next
COPY --chown=bun --from=build /usr/src/app/next.config.mjs ./next.config.mjs

# átállítjuk a felhasználót root-ról
USER bun
# kinyitjuk a 3000-es portot amin elérhető lesz a web applikáció
EXPOSE 3000

# telepítjük a sémát az adatbázisra, seedeljük és indítjuk a webszervert
CMD bun run prisma:deploy && bun prisma db seed && bun start