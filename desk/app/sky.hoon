/+  dbug, default-agent, verb, schooner, server
/$  txt  %noun  %txt
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
+*  this  .
    def   ~(. (default-agent this %|) bowl)
++  on-init
  ^-  (quip card _this)
  :_  this
    [%pass /eyre/connect %arvo %e %connect `/api dap.bowl]~
++  on-save   !>(state)
++  on-load
  |=  old=vase
  ^-  (quip card _this)
  :-  ~
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
      =/  ,request-line:server
        (parse-request-line:server url.request.inbound-request)
      =+  send=(cury response:schooner eyre-id)
    ::
      ?+    method.request.inbound-request
          [(send [405 ~ [%stock ~]]) state]
      ::
          %'DELETE'
        ::  XX %set-response [/url ~] to unbind URL
        ~&  >  "Got DELETE!"
        `state
      ::
          %'GET'
        ::  XX a GET request to an existing endpoint will
        ::     be served by Eyre, so this endpoint should
        ::     only respond to requests to empty point in
        ::     the namespace, so only sends a 404
        ::  XX should have different responses for
        ::     authenticated / non-authenticated requests
        ~&  >  "Got GET!"
        `state
      ::
          %'POST'
        ::  XX CRDT for text files?
        ~&  >  "Got POST!"
        `state
      ::
          %'PUT'
        ~&  >  "Got PUT!"
        ::  XX authenticate this ship, on this path, for this request type
        ::  XX %set-response to the appropriate URL
        ::  XX subscribe to changes on this file, update response
        =/  body                 body.request.inbound-request
        =/  headers              header-list.request.inbound-request
        =/  content-type         (need (get-header:http 'content-type' headers))
        =/  content-disposition  (need (get-header:http 'content-disposition' headers))
        =/  target-url           url.request.inbound-request
        ~&  >  "Target URL: {<target-url>}"
        ?~  body
          ~&  >  "No data received"
          [(send [400 ~ [%plain "No data received"]]) state]
        ~&  >  "Headers: {<headers>}"
        ~&  >  "Content-Type: {<content-type>}"
        ~&  >  "Content-Disposition: {<content-disposition>}"
        ~&  >  "Received body: {<body>}"
        ~!  target-url
        ~!  (trip target-url)
        =/  path-wains
          p:(need q:((cook |=(a=(list wain) a) (more (jest '/') (star ;~(less (jest '/') next)))) [[1 1] (trip target-url)]))
        =/  pax
          ::  XX +turn output is //api/foobar; handle in cord-path converter
          (tail (tail (turn path-wains |=(a=wain (@ta (crip a))))))
        ~&  >>  pax
        =/  file-wains
          p:(need q:((cook |=(a=(list wain) a) (more (jest '.') (star ;~(less (jest '.') next)))) [[1 1] (trip content-disposition)]))
        =/  nym
          (turn file-wains |=(a=wain (@ta (crip a))))
        ~&  >>  nym
        =/  mime-wains
          p:(need q:((cook |=(a=(list wain) a) (more (jest '/') (star ;~(less (jest '/') next)))) [[1 1] (trip content-type)]))
        =/  mim
          (turn mime-wains |=(a=wain (@ta (crip a))))
        =/  file-card
          ?+    mim
              ::  XX bad; remove in prod.
              (head (send [501 ~ [%plain "501 - Not Implemented"]]))
          ::
              [%text %plain ~]
            :*  %pass  ~
                %arvo  %c  %info  %sky  %&
                [fil+(weld pax nym) %ins %txt !>(~[(@t q.u.body)])]~
            ==
          ==
        ~&  >>  file-card
        :_  state
        :-  file-card
        (send [200 ~ [%plain "Data received"]])
      ==
    --
::
++  on-peek   on-peek:def
++  on-watch  
  |=  =path
  `this
++  on-arvo   
  |=  [=wire =sign-arvo]
  ?.  ?=([%eyre %connect ~] wire)
    (on-arvo:def [wire sign-arvo])
  ?>  ?=([%eyre %bound *] sign-arvo)
  ?:  accepted.sign-arvo
    `this
  %-  (slog leaf+"Failed to bind to /api" ~)
  `this
++  on-leave  on-leave:def
++  on-agent  on-agent:def
++  on-fail   on-fail:def
--

