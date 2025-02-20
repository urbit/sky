/+  default-agent
|%
+$  card  $+(card card:agent:gall)
--
%+  verb  &
%-  agent:dbug
^-  agent:gall
|_  =bowl:gall
+*  this  .
    def   ~(. (default-agent this %|) bowl)
++  on-init
  `agent
::
++  on-save
  !>(~)
::
++  on-load
  |=  old-state=vase
  `agent
::
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
      ::  =/  ,request-line:server
      ::    (parse-request-line:server url.request.inbound-request)
      =+  send=(cury response:schooner eyre-id)
    ::
      ?+    method.request.inbound-request
          [(send [405 ~ [%stock ~]]) state]
      ::
          %'GET'
        ~&  >  "Got GET!"
        =/  pax  (get-header:http 'X-Path' header-list.request.inbound-request)
        :_  state
        ::  XX needs to send a poke to their seer;
        ::     their seer will do a %ct on its own clay
        ::     should only return one file, which is the
        ::     one we want
        :~  :*  %pass
                (weld /response pax)
                %arvo
                %k
                %fard
                %base
                %read
                %noun
                !>  ^-  [~ care:clay ship desk case path]
                :*  ~
                    %q
                    (scot %p i.pax)
                    (scot %tas i.t.pax)
                    [%da (from-unix (scot %ud i.t.t.pax))]
                    i.t.t.t.t.pax
                ==
            ==
        ==
      ==
    --
::
++  on-watch
  |=  =path
  ~|  "unexpected subscription to {<dap.bowl>} on path {<path>}"
  !!
::
++  on-leave
  |=  path
  `agent
::
++  on-peek
  |=  =path
  ~|  "unexpected scry into {<dap.bowl>} on path {<path>}"
  !!
::
++  on-agent
  |=  [=wire =sign:agent:gall]
  ^-  (quip card:agent:gall _agent)
  ?-    -.sign
      %poke-ack
    ?~  p.sign
      `agent
    %-  (slog leaf+"poke failed from {<dap.bowl>} on wire {<wire>}" u.p.sign)
    `agent
  ::
      %watch-ack
    ?~  p.sign
      `agent
    =/  =tank  leaf+"subscribe failed from {<dap.bowl>} on wire {<wire>}"
    %-  (slog tank u.p.sign)
    `agent
  ::
      %kick  `agent
      %fact
    ~|  "unexpected subscription update to {<dap.bowl>} on wire {<wire>}"
    ~|  "with mark {<p.cage.sign>}"
    !!
  ==
::
++  on-arvo
  |=  [=wire =sign-arvo]
  ~|  "unexpected system response {<-.sign-arvo>} to {<dap.bowl>} on wire {<wire>}"
  !!
::
++  on-fail
  |=  [=term =tang]
  %-  (slog leaf+"error in {<dap.bowl>}" >term< tang)
  `agent
--
