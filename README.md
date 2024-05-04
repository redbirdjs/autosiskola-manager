# Autós Iskola Manager (Driving School Manager)

Az autós iskola manager web applikáció egy Next.js-ben (React alapú full-stack framework) íródott autós iskola menedzsment applikáció. A papír alapú adminisztrációval ellentétben az autós iskola manager egy egyszerű és gyors megoldást kínál az autós iskolák adminisztratív tevékenységeinek digitalizálására és hatékonyságára.  

## Tartalomjegyzék

- [.env fájl felépítése](#env-felépítése)
- [Telepítés Docker containerbe](#telepítés-docker)
- [Manuális telepítés](#manuális-telepítés)

## .env felépítése

A .env fájl érzékeny adatok tárolására alkalmas, mint például API kulcsok vagy jelszavak. Ezeket a fájlokat legtöbb esetben kitöltetlenül töltik fel a Github repository-kba, hogy úgy tudják mások is használni a feltöltött alkalmazást, hogy közben nem adjuk meg a saját érzékeny adatainkat.

```
DATABASE_URL="postgresql://<username>:<passwd>@<db-host>:<db-port>/<db-name>?schema=<db-schema>"
RESEND_KEY="<resend-api-key>"
REF_SECRET="<refresh-token-secret>"
REF_EXPIRE="1d"
SITE_URL="http://localhost:3000"
IMAGE_PROVIDER="http://localhost:8080"
```

- DATABASE_URL: Adatbázis elérési útvonal a Prisma számára.
- RESEND_KEY: Email kiszolgáló API kulcsa.
- REF_SECRET: Session kezelésre használt Refresh Token rejtjele.
- REF_EXPIRE: Refresh Token lejárati ideje.
- SITE_URL: Weboldal elérési címe
- IMAGE_PROVIDER: Kép kiszolgáló elérési címe.

## Telepítés (Docker)

A webapplikáció telepítése nagyon egyszerű. Az egész applikáció egyszerűen telepíthető
egy Docker containerbe az összes szükséges contrainerrel együtt.

A telepítés előfeltétele, hogy a következő programok telepítve vannak a számítógépre:

- Git - repository letöltéséhez
- Docker - applikáció telepítéséhez és futtatásához

1. Töltsük le a repositoryt a saját számítógépünkre vagy szerverünkre.

```
git clone https://github.com/redbirdjs/autosiskola-manager.git
```

2. Nevezzük át a `.env.example` nevű fájlt `prod.env`-re és töltsük ki a saját adatainkal. (A .env fájl felépítését a fájl tetején vagy [ide kattintva](#env-felépítése) tudja megtekinteni.)

3. Navigáljunk be a létrehozott mappába és futtassuk a következő parancsot:

```
útvonal/a/projekthez > docker compose --build -d
```

4. Ha véget ért a telepítés létrejött a három container és már használható is az applikáció.

## Manuális telepítés

A manuális telepítés valamennyivel nehezebb, mint a Docker konténer létrehozása, ezért a Docker telepítést ajánlom. Amennyiben mégis manuálisan szeretnénk telepíteni a webalkalmazást, szükséges, hogy a számítógépünkön telepítve legyen egy PostgreSQL szerver.

Szükséges szoftverek:

- Bun - Javascript futtatási környezet
- Git - repository letöltéséhez

Ha az adatbázis szerver telepítve van a következő módon tudjuk telepíteni az alkalmazást:

1. Töltsük le a forráskódot a github repository-ból.

```
git clone https://github.com/redbirdjs/autosiskola-manager.git
```

2. Telepítsük a szükséges függőségeket.

```
bun install
```

3. Nevezzük át a `.env.example` nevű fájlt `.env`-re és töltsük ki a saját adatainkal. (A .env fájl felépítését a fájl tetején vagy [ide kattintva](#env-felépítése) tudja megtekinteni.)

4. Generáljuk le a Prisma sémánkat és telepítsük.

```
bunx prisma generate && bun run prisma:migrate
```

5. Készítsük el a production buildet a forráskódból.

```
bun run build
```

6. Indítsuk el a production webalkalmazást.

```
bun start
```

**A futó applikáció a http://localhost:3000 linken érhető el, ha még nem fut applikáció, amely már foglalja a 3000-es portot.**
