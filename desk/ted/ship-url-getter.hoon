/-  spider
/+  *strandio
=,  strand=strand:spider
=,  dejs-soft:format
=,  strand-fail=strand-fail:libstrand:spider
^-  thread:spider
|=  arg=vase
=/  m  (strand ,vase)
^-  form:m
=/  u-ship  !<((unit @p) arg)
?~  u-ship  (strand-fail %no-arg ~)
=/  ship=tape  (scow %p (need u-ship))
=/  url  "https://bitdeg.arvo.network/apps/ship-url-getter/{ship}"
;<  =json  bind:m  (fetch-json url)
=/  ship-url=(unit tape)  (sa json)
?~  ship-url  
  ~&  >>>  "Url for {ship} not found"
  (pure:m !>(~))
(pure:m !>(ship-url))