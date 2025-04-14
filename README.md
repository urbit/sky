# Piraeus

Urbit namespace browser, spiritual successor to the [urbit/shrub](https://github.com/urbit/shrub) prototype and the [Aegean](https://tiller-tolbus.redhorizon.com/blog/aegean) proposal.

## Developer Environment Setup

Use Vite to run the frontend.

```
$ cd piraeus/ui
$ pnpm install
$ pnpm dev
```

Vite expects a ~zod running on localhost:8080, but you can configure this in an .env.local file.

```
VITE_SHIP_URL=http://localhost:80
```

Boot up a fake ~zod and copy the contents of `/desk` to the ship.

```
$ ./urbit -F zod
> |new-desk %sky
> |mount %sky
```

```
$ cd piraeus
$ cp -r desk/* path/to/pier/sky
```

```
> |commit %sky
> |install our %sky
```
