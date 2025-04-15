# Sky

Urbit namespace browser, spiritual successor to the [urbit/shrub](https://github.com/urbit/shrub) prototype and the [Aegean](https://tiller-tolbus.redhorizon.com/blog/aegean) proposal.

## Developer Environment Setup

The developer environment requires a fake \~zod (yes, it has to be \~zod) and expects that \~zod to be running on localhost:8080, but you can configure that URL in an .env.local file in the `/ui` folder.

```
VITE_SHIP_URL=http://localhost:80
```

Boot up your fake \~zod and copy the contents of `/desk` to its %sky desk.

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

Use Vite to run the frontend.

```
$ cd sky/ui
$ pnpm install
$ pnpm dev
```

Go to the Vite URL in the terminal ending `/apps/sky` to use Sky.

Sky only works in an authenticated browser session, so you'll need to log into the ship with its `+code` for Sky to be able to communicate with it.

For the Vite frontend to talk to the fakeship, you'll also need to run `|cors-approve 'http://localhost:5173'` in the dojo.
