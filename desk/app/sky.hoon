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
+*  this  .
    def   ~(. (default-agent this %|) bowl)
++  on-init
  ^-  (quip card _this)
  ::  XX %connect to /sky, not /api
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
        [(send [501 ~ [%plain "501 - Not Implemented"]]) state]
      ::
          %'GET'
        ::  XX send response
        ::  XX %set-response
        ::  XX subscribe to this file in clay
        ::  XX think about authentication
        ~&  >  "Got GET!"
        :_  state
        =/  dst  url.request.inbound-request
        =/  pax  (tail (cut-path dst '/'))
        =/  hed  header-list.request.inbound-request
        =/  res  .^((list path) %ct (weld /(scot %p our.bowl)/sky/(scot %da now.bowl)/fil pax))
        ?~  res
          (send [404 ~ [%plain "404 - Not Found"]])
        =/  fil  (head res)
        ~&  >  "Getting {<fil>}"
        =/  typ  (head (flop fil))
        =/  non  .^(noun %cx (weld /(scot %p our.bowl)/sky/(scot %da now.bowl) fil))
        ::  noun-to-whatever converter
        =/  to-type
          .^(tube:clay %cc /(scot %p our.bowl)/sky/(scot %da now.bowl)/noun/[typ])
        ::  whatever-to-mime converter
        =/  to-mime
          .^(tube:clay %cc /(scot %p our.bowl)/sky/(scot %da now.bowl)/[typ]/mime)
        ::  convert noun to whatever to mime
        =/  mim
          !<(mime (to-mime (to-type !>(non))))
        ~&  >  "MIME: {<mim>}"
        ::  XX other cards: %set-response, %warp %next
        ^-  (list card)
        %+  give-simple-payload:app:server
          eyre-id
        ^-  simple-payload:http
        :-  :-  200
            ['content-type'^(ext-to-mime typ)]~
        (some +.mim)
      ::
          %'POST'
        ::  XX CRDT for text files?
        ~&  >  "Got POST!"
        [(send [501 ~ [%plain "501 - Not Implemented"]]) state]
      ::
          %'PUT'
        ~&  >  "Got PUT!"
        ::  XX authenticate this ship, on this path, for this request type
        =/  body  body.request.inbound-request
        =/  hed   header-list.request.inbound-request
        =/  typ   (need (get-header:http 'content-type' hed))
        =/  dis   (need (get-header:http 'content-disposition' hed))
        =/  dst   url.request.inbound-request
        ?~  body
          ~&  >  "No data received"
          [(send [400 ~ [%plain "No data received"]]) state]
        =/  pax
          (tail (cut-path dst '/'))
        ~&  >>  pax
        =/  nym
          (cut-path dis '.')
        ~&  >>  nym
        =/  mim
          (cut-path typ '/')
        ~&  >>  mim
        =/  ext  (head (flop nym))
        ~&  >>  ext
        ::  noun-to-whatever converter
        =/  to-type
          .^(tube:clay %cc /(scot %p our.bowl)/sky/(scot %da now.bowl)/noun/[ext])
        =/  file-card
          ^-  card
          :*  %pass  ~
              %arvo  %c  %info  %sky  %&
              [fil+(weld pax nym) %ins ext (to-type !>(q.u.body))]~
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
  ::  XX handle changes to clay file we're subscribed to;
  ::     %set-response for the new file
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

