# Sky

Urbit namespace browser, spiritual successor to the [urbit/shrub](https://github.com/urbit/shrub) prototype and the [Aegean](https://tiller-tolbus.redhorizon.com/blog/aegean) proposal.

## Production Environment

To build Sky for globbing on a ship, run `pnpm build` in the `/ui` folder, then as usual install the desk and glob the frontend at `<ship url>/docket/upload`.

## Developer Environment

The developer environment requires a fakeship and expects that fakeship to be running on localhost:80 by default, but if you want to run it on another port you can specify that port in a file called `.env.local` in the `/ui` folder, and set the `VITE_SHIP_URL` environment variable like so:

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

Go to `http://localhost:5173/apps/sky/` to use Sky.

