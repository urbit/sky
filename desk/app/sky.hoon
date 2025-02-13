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
  =/  init-paths
    %+  weld
      ~[/fil/home/html /fil/app-data/json]
    .^((list path) %ct /(scot %p our.bowl)/sky/(scot %da now.bowl)/fil/sys)
  =/  eyre-cards
    ^-  (list card)
    %+  turn
      init-paths
    |=  =path
    ^-  card
    =/  non  .^(noun %cx (weld /(scot %p our.bowl)/sky/(scot %da now.bowl) path))
    =/  mim
      ((type-to-mime (rear path)) ((noun-to-type (rear path)) non))
    ::  ~&  >>  mim
    =/  pax-cord
      (crip (weld "/" (tape (join '/' (turn (snip (oust [0 1] path)) |=(=term (cord term)))))))
    ~&  >>  pax-cord
    :*  %pass  /eyre/cache
        %arvo  %e
        %set-response  pax-cord
        ~  %.y  %payload
        :-  200
        :~  ['Content-Type' (ext-to-mime (rear path))]
            ['Access-Control-Allow-Origin' '*']
            ['X-Urbit-Desk' 'Sky']
        ==
        (some +.mim)
    ==
  ::
  ::  in case we're |reviving sky, clear
  ::  paths that sky cached in eyre
  =/  clear-cache-cards
    ^-  (list card)
    =/  old-cache  .^((map url=@t [aeon=@ud val=(unit cache-entry:eyre)]) %e /(scot %p our.bowl)/cache/(scot %da now.bowl))
    %+  murn
      ~(tap by old-cache)
    |=  [url=@t [aeon=@ud val=(unit cache-entry:eyre)]]
    ?~  val
      ~
    ?.  %+  lien
          headers.response-header.simple-payload.body.u.val
        |=  [key=@t value=@t]
        =([key value] ['X-Urbit-Desk' 'Sky'])
      ~&  >  "Not a Sky URL"
      ~
    ~&  >  "Clearing Sky's cached URL {<url>}"
    %-  some
    [%pass /eyre/cache %arvo %e %set-response url ~]
  :_  this
  ;:  weld
      clear-cache-cards
      eyre-cards
      ^-  (list card)
      [%pass /eyre/connect %arvo %e %connect `/api dap.bowl]~
  ==
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
        ::  [(send [501 ~ [%plain "501 - Not Implemented"]]) state]
        :_  state
        =/  dst  url.request.inbound-request
        =/  pax  (tail (cut-path dst '/'))
        =/  res
          .^((list path) %ct (weld /(scot %p our.bowl)/sky/(scot %da now.bowl)/fil pax))
        =/  pax-cord
          (crip (weld "/" (tape (join '/' (turn pax |=(=term (cord term)))))))
        ::
        ::  pax may be a file or directory, so
        ::  delete everything "under" it
        =/  del-cards
          %+  turn
            res
          |=  =path
          ^-  card
          :*  %pass  ~
              %arvo  %c  %info  %sky  %&
              [path %del ~]~
          ==
        :-  [%pass /eyre/cache %arvo %e %set-response pax-cord ~]
        del-cards
      ::
          %'GET'
        ::  XX subscribe to this file in clay
        ::  XX think about authenticaing before anything else
        ::     this API agent should just be for us
        ~&  >  "Got GET!"
        ::  ~&  >  "GET is from {<request.inbound-request>}"
        :_  state
        =/  dst  url.request.inbound-request
        =/  pax  (tail (cut-path dst '/'))
        ::  XX should handle GET requests for e.g. /sys/css/spine.css
        =/  res  .^((list path) %ct (weld /(scot %p our.bowl)/sky/(scot %da now.bowl)/fil pax))
        ?~  res
          (send [404 ~ [%plain "404 - Not Found"]])
        ?:  (gth (lent res) 1)
          ::  XX serve directory with both files if
          ::     the client has permission to read
          ::     this node and the files beneath
          (send [501 ~ [%plain "501 - Not Implemented"]])
        =/  fil  (head res)
        ?:  =(fil (weld /fil pax))
          ::  XX handle directory with no "children";
          ::     this directory should be removed the
          ::     next time this desk is committed
          (send [501 ~ [%plain "501 - Not Implemented"]])
        =/  typ  (rear fil)
        =/  non  .^(noun %cx (weld /(scot %p our.bowl)/sky/(scot %da now.bowl) fil))
        =/  mim
          ((type-to-mime typ) ((noun-to-type typ) non))
        ::  XX other cards: %set-response, %warp %next
        =/  pax-cord
          (crip (weld "/" (tape (join '/' (turn pax |=(=term (cord term)))))))
        =/  mim-cord
          (crip (tape (join '/' (turn -.mim |=(=term (cord term))))))
        =/  eyre-card
          ^-  card
          :*  %pass  /eyre/cache
              %arvo  %e
              %set-response  pax-cord
              ~  %.y  %payload
              :-  200
              :~  ['Content-Type' mim-cord]
                  ['Access-Control-Allow-Origin' '*']
                  ['X-Urbit-Desk' 'Sky']
              ==
              (some +.mim)
          ==
        ::  ~&  >>  file-card
        ::  ~&  >  "Cacheing to {<pax-cord>}"
        :-  eyre-card
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
        =/  line  (parse-request-line:server url.request.inbound-request)
        =/  mime  (~(get by (malt args.line)) 'mime')
        =/  name  (~(get by (malt args.line)) 'name')
        ?~  body
          [(send [400 ~ [%plain "No data received"]]) state]
        ?~  mime
          [(send [400 ~ [%plain "No MIME type provided"]]) state]
        ?~  name
          [(send [400 ~ [%plain "No filename provided"]]) state]
        =/  pax  (tail site.line)
        ::  XX incorrectly parses filenames with '.' before extension
        =/  nym  (cut-path value.u.name '.')
        =/  ext  (rear nym)
        =/  fil  ((noun-to-type ext) q.u.body)
        =/  file-card
          ^-  card
          :*  %pass  ~
              %arvo  %c  %info  %sky  %&
              [(weld /fil (weld pax nym)) %ins ext !>(fil)]~
          ==
        =/  pax-cord
          (crip (weld "/" (tape (join '/' (turn pax |=(=term (cord term)))))))
        =/  mim
          ((type-to-mime ext) fil)
        =/  mim-cord
          (crip (tape (join '/' (turn -.mim |=(=term (cord term))))))
        =/  eyre-card
          ^-  card
          :*  %pass  /eyre/cache
              %arvo  %e
              %set-response  pax-cord
              ~  %.y  %payload
              :-  200
              :~  ['Content-Type' mim-cord]
                  ['Access-Control-Allow-Origin' '*']
                  ['X-Urbit-Desk' 'Sky']
              ==
              (some +.mim)
          ==
        :_  state
        :-  file-card
        :-  eyre-card
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
  ^-  (quip card _this)
  ~&  >>  wire
  ?+    wire
      ~_  leaf/"sky: unrecognized wire {<wire>}"
      !!
      [%eyre %connect ~]
    ?>  ?=([%eyre %bound *] sign-arvo)
    ?:  accepted.sign-arvo
      `this
    %-  (slog leaf/"sky: failed to bind {<dap.bowl>} to /api" ~)
    `this
  ::
      [%eyre %cache ~]
    ?>  ?=([%eyre %grow *] sign-arvo)
    %-  (slog leaf/"sky: cached path {<path.sign-arvo>}" ~)
    `this
  ==
++  on-leave  on-leave:def
++  on-agent  on-agent:def
++  on-fail   on-fail:def
--

