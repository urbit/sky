/+  *sky, dbug, verb, server, schooner, default-agent
|%
+$  versioned-state
  $%  state-0
  ==
+$  state-0  [%0 ~]
+$  card  $+(card card:agent:gall)
--
%+  verb  &
%-  agent:dbug
=|  state-0
=*  state  -
^-  agent:gall
|_  =bowl:gall
+*  this     .
    def  ~(. (default-agent this %|) bowl)
++  on-init
  ^-  (quip card _this)
  ~&  >  "%seer initialized successfully."
  :_  this
  [%pass /eyre/connect %arvo %e %connect `/api dap.bowl]~
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
    ?+    mark  (on-poke:def mark vase)
        %handle-http-request
      ~&  >>  src.bowl
      ?>  =(src.bowl our.bowl)
      =^  cards  state
        (handle-http !<([@ta =inbound-request:eyre] vase))
      [cards this]
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
        ?:  =(our.bowl (scot %p (head path)))
          :: XX return HTTP res and FQSP as a X-FQSP header
          =/  ver  (~(get by sky.bowl) (tail path))
          ?~  ver
            !!
          =/  on-path  ((on @ud (pair @da (each page @uvI))) lte)
          ::  XX i think this is getting latest date
          =/  neu  (ram:on-path (need ver))
          ?~  neu
            ::  nothing here
            `state
          ?.  (head q.val.u.neu)
            ::  tombstoned
            `state
          ::  take (pair mark noun) and return as mime
          ::  so will need x-to-mime mark
          `state
        :: XX find if this is their Eyre or Gall
        `state
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
++  on-agent  on-agent:def
++  on-fail   on-fail:def
--
