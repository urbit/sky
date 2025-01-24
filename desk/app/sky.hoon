/+  dbug, default-agent, verb, schooner, server
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
        ~&  >  "Got DELETE!"
        `state
      ::
          %'GET'
        ~&  >  "Got GET!"
        `state
      ::
          %'POST'
        ~&  >  "Got POST!"
        `state
      ::
          %'PUT'
        ~&  >  "Got PUT!"
        ::  XX authenticate this ship, on this path, for this request type
        ::  XX make file in clay at appropriate path
        ::  XX %set-response to the appropriate URL in +on-arvo
        =/  data          body.request.inbound-request
        =/  headers       header-list.request.inbound-request
        =/  content-type  (get-header:http 'content-type' headers)
        =/  target-url  url.request.inbound-request
        ~&  >  "Target URL: {<target-url>}"
        ?~  data
          [(send [400 ~ [%plain "No data received"]]) state]
        ~&  >  "Content-Type: {<content-type>}"
        ~&  >  "Received data: {<data>}"
        [(send [200 ~ [%plain "Data received"]]) state]
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

