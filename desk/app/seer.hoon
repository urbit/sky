/+  *sky, dbug, verb, server, schooner, default-agent
|%
+$  versioned-state
  $%  state-0
  ==
+$  state-0  [%0 ~]
+$  card  $+(card card:agent:gall)
+$  bar-action  =path
--
::
%+  verb  &
%-  agent:dbug
=|  state-0
=*  state  -
^-  agent:gall
|_  =bowl:gall
+*  this  .
    def   ~(. (default-agent this %|) bowl)
::
++  on-init
  ^-  (quip card _this)
  ~&  >  "%seer initialized successfully."
  =/  htm  '<!DOCTYPE html><html><head><title>200 Success</title></head><body><h1>200 Success</h1></body></html>'
  :_  this
  :~  :*  %pass  /eyre/connect
          %arvo  %e  %connect
          [`/seer dap.bowl]
      ==
      ::  XX handle gift at /call/back/path
      :*  %pass  ~
          %grow  /sys/http-test
          [%html htm]
      ==
  ==
++  on-save   !>(state)
++  on-load
  |=  old=vase
  ^-  (quip card _this)
  :-  ^-  (list card)
      ~
  %=  this
    state  !<(state-0 old)
  ==
++  on-poke
  |=  [=mark =vase]
  ^-  (quip card _this)
  |^
    ?+    mark
      (on-poke:def mark vase)
    ::
        %handle-http-request
      ~&  >>  src.bowl
      ?>  =(src.bowl our.bowl)
      =^  cards  state
        (handle-http !<([@ta =inbound-request:eyre] vase))
      [cards this]
    ::
        %foo-poke
      =/  act  !<(bar-action vase)
      =/  =path  path.act
      =/  ver    (~(get by sky.bowl) (tail path))
      ?~  ver
        ~&  >>>  "No versions found"
        !!
      =/  on-path  ((on @ud (pair @da (each page @uvI))) lte)
      ::  XX i think +ram is getting latest date
      ::     but check this works as expected
      =/  neu  (ram:on-path (need ver))
      ?~  neu
        ::  nothing here
        ~&  >>>  "Nothing here"
        !!
      ?.  -.q.val.u.neu
        ::  tombstoned
        ~&  >>>  "Latest version is tombstoned"
        !!
      ?>  ?=(page p.q.val.u.neu)
      =*  mar  p.p.q.val.u.neu
      =/  mim
        %-  (type-to-mime mar)
        %-  (noun-to-type mar)
        q.p.q.val.u.neu
      ~&  >  "Returning a response"
      ::  XX return MIME response of file
      ::  XX return FQSP
      `this
    ==
    ::
    ++  handle-http
      |=  [eyre-id=@ta =inbound-request:eyre]
      ^-  (quip card _state)
      =+  send=(cury response:schooner eyre-id)
    ::
      ?+    method.request.inbound-request
          [(send [405 ~ [%stock ~]]) state]
      ::
          %'GET'
        =/  line  (parse-request-line:server url.request.inbound-request)
        =/  pax   (~(get by (malt args.line)) 'path')
        ?~  pax
          [(send [400 ~ [%plain "No data received"]]) state]
        =/  =path  (cut-path value.u.pax '/')
        ~&  >  path
        ~&  >>  sky.bowl
        =/  =ship  `@p`(slav %p (head path))
        ?:  =(ship our.bowl)
          ::
          ::  our path
          =/  ver  (~(get by sky.bowl) (tail path))
          ?~  ver
            [(send [404 ~ [%plain "Not found"]]) state]
          =/  on-path  ((on @ud (pair @da (each page @uvI))) lte)
          ::  XX i think +ram is getting latest date
          ::     but check this works as expected
          =/  neu  (ram:on-path (need ver))
          ?~  neu
            ::  nothing here
            [(send [404 ~ [%plain "Not found"]]) state]
          ?.  -.q.val.u.neu
            ::  tombstoned
            [(send [410 ~ [%plain "Gone"]]) state]
          ?>  ?=(page p.q.val.u.neu)
          =*  mar  p.p.q.val.u.neu
          =/  mim
            %-  (type-to-mime mar)
            %-  (noun-to-type mar)
            q.p.q.val.u.neu
          :_  state
          ^-  (list card)
          %+  give-simple-payload:app:server
            eyre-id
          ^-  simple-payload:http
          :-  :-  200
              ::  XX form real FQSP
              :~  ['Content-Type' (ext-to-mime mar)]
                  ['X-FQSP' '~zod/foo']
              ==
          (some +.mim)
        ::
        ::  foreign path
        ~&  >   "Sending request to {<ship>} for {<(tail path)>}"
        ~&  >>  eyre-id
        ~&  >>  /keen/init/[eyre-id]
        :_  state
        :~  :*  %pass
                /keen/init/[eyre-id]
                %agent
                [ship %seer]
                %poke
                %foo-poke
                !>(path)
        ==  ==
      ==
    --
::
++  on-peek
  |=  path=(pole knot)
  ^-  (unit (unit cage))
  ``[%noun !>(~)]
++  on-watch
  |=  path=(pole knot)
  ^-  (quip card _this)
  `this
++  on-arvo
  |=  [=wire =sign-arvo]
  ^-  (quip card _this)
  ?+    sign-arvo  (on-arvo:def [wire sign-arvo])
      [%eyre %bound *]
    ?:  accepted.sign-arvo
      %-  (slog leaf+"/{(trip dap.bowl)} bound successfully!" ~)
      [~ this]
    %-  (slog leaf+"Binding /{(trip dap.bowl)} failed!" ~)
    [~ this]
  ==
++  on-leave  on-leave:def
++  on-agent
  |=  [=wire =sign:agent:gall]
  ^-  (quip card _this)
  ?+  wire
    (on-agent:def wire sign)
  ::
      [%keen %init @ ~]
    ~&  >  "Got response"
    =/  eyre-id=@ta  i.t.t.wire
    ~&  >>  eyre-id
    ?+  -.sign
      (on-agent:def wire sign)
    ::
        %poke-ack
      ?~  p.sign
        ~&  >  "Got ack"
        :_  this
        %+  give-simple-payload:app:server
          eyre-id
        ^-  simple-payload:http
        :-  :-  200
            ::  XX send FQSP in headers
            ::  XX get mime header from response
            :~  ['Content-Type' 'text/html']
            ==
        =/  htm  '<!DOCTYPE html><html><head><title>200 Success</title></head><body><h1>200 Success</h1></body></html>'
        %-  some
        :-  (met 3 htm)
        htm
        ::  :-  /text/html
      ~&  >>>  "Got nack"
      :_  this
      %+  give-simple-payload:app:server
          eyre-id
      ^-  simple-payload:http
      :-  :-  404
          ::  XX send FQSP in headers
          ::  XX get mime header from response
          :~  ['Content-Type' 'text/plain']
          ==
      %-  some
      %-  tail
      *mime
      ::  :-  /text/html
      :: '<!DOCTYPE html><html><head><title>404 Not Found</title></head><body><h1>404 Not Found</h1></body></html>'
    ::
    ==
  ==
++  on-fail   on-fail:def
--
