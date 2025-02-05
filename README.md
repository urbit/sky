# Piraeus

Urbit namespace browser, spiritual successor to the [urbit/shrub](https://github.com/urbit/shrub) prototype and the [Aegean](https://tiller-tolbus.redhorizon.com/blog/aegean) proposal.

## Developer Environment Setup

Use Vite to preview frontend changes.

```
cd piraeus/ui
pnpm install
pnpm dev
```

Run [json-server](https://github.com/typicode/json-server) on `localhost:3000` to run a JSON API for resolving `@p`s to top-level domains.

```
cd piraeus/athens
npx json-server dns.json --port 3000
```

To make HTTP requests to a fakeship, include the fakeship URL in an `.env` file in `/ui`.

```
VITE_SHIP_URL=http://localhost:8080
```
