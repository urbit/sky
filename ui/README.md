# Sky

Urbit namespace browser, spiritual successor to the [urbit/shrub](https://github.com/urbit/shrub) prototype and the [Aegean](https://tiller-tolbus.redhorizon.com/blog/aegean) proposal.

## Developer Environment Setup

Use Vite to preview frontend changes.

```
cd sky/ui
pnpm install
pnpm dev
```

Run [json-server](https://github.com/typicode/json-server) on `localhost:3000` to run a JSON API for resolving `@p`s to top-level domains.

```
cd sky/athens
npx json-server dns.json --port 3000
```

Run `server.py` (which is hard-coded to run on `localhost:8000`) to run the mock fileserver, which enables reading and writing to your (`~sampel`'s) namespace. You'll need to install the `flask` and `flask_cors` modules if you don't have them.

```
cd sky/athens
python server.py
```
