/+  dbug, default-agent, verb, schooner, server
|%
+$  versioned-state
  $%  state-0
  ==
::  XX dummy state
+$  state-0
  $:  %0
      values=(list @)
  ==
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
    ++  handle-http
      |=  [eyre-id=@ta =inbound-request:eyre]
      ^-  (quip card _state)
      =/  ,request-line:server
        (parse-request-line:server url.request.inbound-request)
      =+  send=(cury response:schooner eyre-id)
    ::
      ?+    method.request.inbound-request  [(send [405 ~ [%stock ~]]) state]
      ::
          %'DELETE'
        ~&  >  "Got DELETE!"
        !!
      ::
          %'GET'
        ~&  >  "Got GET!"
        !!
      ::
          %'POST'
        ~&  >  "Got POST!"
        !!
      ::
          %'PUT'
        ~&  >  'Got PUT'
        !!
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
  %-  (slog leaf+"Binding /api failed!" ~)
  `this
++  on-leave  on-leave:def
++  on-agent  on-agent:def
++  on-fail   on-fail:def
--

