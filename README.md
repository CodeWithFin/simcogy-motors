# Simcogy Motors

Single-seller car inventory and storefront for the Kenyan market.

## Stack

- Next.js (App Router)
- PostgreSQL
- Car photos saved on the server (in a Docker volume)
- Tailwind CSS
- Docker Compose

## Run on a server with Docker

1. Install Docker on the server and copy this project to it.
2. Copy `.env.example` to `.env` and fill in the values. Use a long `POSTGRES_PASSWORD` made of letters and numbers, and change `ADMIN_PASSWORD` and `JWT_SECRET`.

   Set `NEXT_PUBLIC_SITE_URL` to the address people will use, e.g. `https://simcogymotors.com` or `http://<server-ip>:3000`.
3. Start everything:

   ```bash
   docker compose up -d --build
   ```

   The site runs on port `3000`. The first start creates the database tables from `schema.sql`.

### HTTPS with a domain (optional)

Point your domain at the server, add `DOMAIN=simcogymotors.com` to `.env`, set `NEXT_PUBLIC_SITE_URL=https://simcogymotors.com`, then run:

```bash
docker compose --profile https up -d --build
```

Caddy gets and renews the HTTPS certificate automatically.

### Where data is kept

| What | Docker volume |
|------|---------------|
| Database | `pgdata` |
| Car photos | `uploads` |

These survive restarts and rebuilds. Back them up with:

```bash
docker compose exec db pg_dump -U simcogy simcogy > backup.sql
docker compose cp app:/app/uploads ./uploads-backup
```

### Updating the site

```bash
git pull
docker compose up -d --build
```

Changes to `NEXT_PUBLIC_*` values in `.env` need the `--build` flag to take effect.

## Moving from Neon / ImageKit

Export the old database and load it into the new one:

```bash
pg_dump "<old neon url>" --data-only --no-owner > data.sql
docker compose exec -T db psql -U simcogy simcogy -c "TRUNCATE sellers CASCADE;"
docker compose exec -T db psql -U simcogy simcogy < data.sql
```

If the old dump still uses the `imagekit_file_id` column, rename it in `data.sql` to `storage_key` before loading. Old photos keep loading from ImageKit; new uploads are saved on the server.

## Local development

1. Start just the database: `docker compose up -d db`
2. Copy `.env.example` to `.env` (the default `DATABASE_URL` points at it)
3. `npm install`
4. `npm run dev`

## Admin

Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env`. Sign in at `/admin/login`.
