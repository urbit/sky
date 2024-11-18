/+  dbug, default-agent, verb, server
|%
+$  versioned-state
  $%  state-0
  ==
+$  state-0  ~
+$  card  $+(card card:agent:gall)
::
::  %landscape types
+$  version
  $+  version
  $~  [0 0 0]
  [major=@ud minor=@ud patch=@ud]
::
+$  glob-location
  $+  glob-location
  $%  [%http url=cord]
      [%ames =ship]
  ==
::
+$  glob-reference
  $+  glob-reference
  [hash=@uvH location=glob-location]
::
+$  href
  $+  href
  $~  [%site /]
  $%  [%glob base=term =glob-reference]
      [%site =path]
  ==
::
+$  docket-0
  $+  docket-0
  $~  [%1 '' '' 0x0 *href ~ *version '' '']
  $:  %1
      title=@t
      info=@t
      color=@ux
      =href
      image=(unit @t)
      =version
      website=@t
      license=@t
  ==
::
+$  treaty
  [=ship =desk =case hash=@uv =docket-0]
::
+$  sovereign-update
  $%  [%ini (map desk treaty)]
      [%add =desk =treaty]
      [%del =desk =treaty]
  ==
--
::  XX turn verb off in production
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
  ~&  >  'Subscribing to /sovereign'
  :_  this
  :~  :*  %pass
          /sovereign-updates
          %agent
          [our.bowl %treaty]
          %watch
          /sovereign
      ==
  ==
::
++  on-save   !>(state)
++  on-load
  |=  old=vase
  ^-  (quip card _this)
  :-  ~
  %=  this
    state  !<(state-0 old)
  ==
::
++  on-poke
  ::  XX bind a desk we've published, error if URL already taken
  ::  XX bind a desk we've published, overwrite existing URL
  |=  [=mark =vase]
  ^-  (quip card _this)
  ?+  mark
    ~_  [%leaf "{<dap.bowl>}: unexpected mark {<mark>}"]
    !!
  ::
      %handle-http-response
    =/  req  !<([eyre-id=@ta =inbound-request:eyre] vase)
    =/  ,request-line:server
      (parse-request-line:server url.request.inbound-request.req)
    ~&  >>  req
    ?+  method.request.inbound-request.req
      ~_  [%leaf "{<dap.bowl>}: unsupported method {<method.request.inbound-request.req>}"]
      !!
    ::
        %'GET'
      ?+  site
        ~_  [%leaf "Unexpected site {<site>}"]
        !!
      ::
          [@ ~]
        ~&  inbound-request.req
        `this
      ==
    ==
  ==
::
++  on-peek   on-peek:def
++  on-watch  on-watch:def
++  on-arvo
  |=  [=wire =sign-arvo]
  ^-  (quip card _this)
  ?.  ?=([%eyre %connect @tas ~] wire)
    (on-arvo:def [wire sign-arvo])
  ?>  ?=([%eyre %bound *] sign-arvo)
  ?:  accepted.sign-arvo
    %-  (slog leaf+"Bound successfully!" ~)
    `this
  %-  (slog leaf+"Binding failed!" ~)
  `this
++  on-leave  on-leave:def
++  on-agent
  |=  [=wire =sign:agent:gall]
  ^-  (quip card _this)
  ?+  -.sign
    ~_  [%leaf "{<dap.bowl>}: unexpected {<-.sign>} on {<wire>}"]
    !!
  ::
      %kick
    ~&  >>  "Got %kick on {<wire>}"
    `this
  ::
      %watch-ack
    ~&  >  "Got %watch-ack on {<wire>}"
    `this
  ::
      %fact
    ~&  >  "Got %fact on {<wire>}"
    =*  mark  p.cage.sign
    =*  vase  q.cage.sign
    ?+  mark
      ~_  [%leaf "{<dap.bowl>}: unexpected %fact with mark {<mark>}"]
      !!
    ::
        %sovereign-update-0
      =/  upd  !<(sovereign-update vase)
      ?-  -.upd
          %ini
        :_  this
        ::  XX check if URL exists, error if so
        %+  turn
          ~(tap by +.upd)
        |=  [=desk =treaty]
        ^-  card
        :*  %pass  /eyre/connect/[desk]  %arvo  %e
            %connect  [~ /[`@t`desk]]  dap.bowl
        ==
      ::
          %add
        :_  this
        ::  XX check if URL exists, error if so
        :~  :*  %pass  /eyre/connect/[desk.upd]  %arvo  %e
                %connect  [~ /[`@t`desk.upd]]  dap.bowl
            ==
        ==
      ::
          %del
        :_  this
        :~  :*  %pass  /eyre/connect/[desk.upd]  %arvo  %e
                %disconnect  [~ /[`@t`desk.upd]]
            ==
        ==
      ==
    ==
  ==
++  on-fail   on-fail:def
--

