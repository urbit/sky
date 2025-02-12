# Piraeus

Urbit namespace browser, spiritual successor to the [urbit/shrub](https://github.com/urbit/shrub) prototype and the [Aegean](https://tiller-tolbus.redhorizon.com/blog/aegean) proposal.

## Developer Environment Setup

Use Vite to preview frontend changes.

```
$ cd piraeus/ui
$ pnpm install
$ pnpm dev
```

Run [json-server](https://github.com/typicode/json-server) on `localhost:3000` to run a JSON API for resolving `@p`s to top-level domains.

```
$ cd piraeus/athens
$ npx json-server dns.json --port 3000
```

Boot up a fake ~zod on localhost:8080 and copy the contents of `/desk` to the ship.

```
$ ./urbit -F zod --http-port 8080
> |new-desk %sky
> |mount %sky
```

```
$ cd /piraeus
$ cp -r desk/* path/to/pier/sky
```

```
> |commit %sky
> |install our %sky
```
