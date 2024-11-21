# Sky

Urbit namespace browser, spiritual successor to the [urbit/shrub](https://github.com/urbit/shrub) prototype and the [Aegean](https://tiller-tolbus.redhorizon.com/blog/aegean) proposal.

## Developer Environment Setup

Use Vite to preview frontend changes.

```
cd sky/ui
pnpm install
pnpm run dev
```

Run [json-server](https://github.com/typicode/json-server) on `localhost:3000` to run a mock backend and JSON API.

```
cd sky
pnpm add -g json-server
npx json-server dns.json --port 3000
```
