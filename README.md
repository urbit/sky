# Sky

Urbit namespace browser, spiritual successor to the [urbit/shrub](https://github.com/urbit/shrub) prototype and the [Aegean](https://tiller-tolbus.redhorizon.com/blog/aegean) proposal.

## Developer Environment Setup

The developer environment requires a fakeship and expects that fakeship to be running on localhost:80, but you can specify another port in an .env.local file in the `/ui` folder.

```
VITE_SHIP_URL=http://localhost:8080
```

Boot up your fakeship and copy the contents of `/desk` to its %sky desk.

```
$ ./urbit -F zod
> |new-desk %sky
> |mount %sky
```

```
$ cd sky
$ cp -r desk/* path/to/pier/sky
```

```
> |commit %sky
> |install our %sky
```

Sky only works in an authenticated browser session, so you'll need to log into the ship with its `+code` for Sky to be able to communicate with it.

For the Vite frontend to talk to the fakeship, you'll also need to run `|eyre/cors/approve 'http://localhost:5173'` in the dojo.

Use Vite to run the frontend.

```
$ cd sky/ui
$ pnpm install
$ pnpm dev
```

Go to `http://127.0.0.1:5173/apps/sky/` to use Sky.
