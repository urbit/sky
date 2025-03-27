/-  *seer
/+  *sky, dbug, verb, server, schooner, default-agent
|%
+$  versioned-state
  $%  state-0
  ==
+$  state-0  [%0 ~]
+$  card  $+(card card:agent:gall)
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
  =/  init-paths
    %+  weld
      ^-  (list path)
      :~  /fil/home/html
          /fil/sys/http-test/html
          /fil/app-data/json
      ==
    .^((list path) %ct /(scot %p our.bowl)/sky/(scot %da now.bowl)/fil/sys)
  =/  grow-cards
    %+  turn
      init-paths
    |=  =path
    ^-  card
    =/  non  .^(noun %cx (weld /(scot %p our.bowl)/sky/(scot %da now.bowl) path))
    =/  mim  ((type-to-mime (rear path)) ((noun-to-type (rear path)) non))
    ::  XX is there a gift at /call/back/path?
    :*  %pass  ~
        %grow  (tail (snip path))
        [%mime mim]
    ==
  :_  this
  :_  grow-cards
  :*  %pass  /eyre/connect
      %arvo  %e  %connect
      [`/seer dap.bowl]
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
  ~&  >  "Got poke"
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
      ~&  >  "Got %foo-poke"
      =/  act  !<(foo-poke vase)
      =/  ver  (~(get by sky.bowl) (tail path.act))
      ?~  ver
        ~&  >>>  "No versions found for {<(tail path.act)>}"
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
      =/  =mime  (mime q.p.q.val.u.neu)
      ~&  >  "Returning a response for {<eyre-id.act>}"
      ::  XX return FQSP
      :_  this
      :~  :*  %pass
              ~
              %agent
              [src.bowl %seer]
              %poke
              %baz-response
              !>([eyre-id.act /foo/bar mime])
      ==  ==
    ::
        %baz-response
      ~&  >  "Got %baz-response"
      ~&  >>  vase
      =/  act  !<(baz-response vase)
      =/  mim-cord
        (crip (tape (join '/' (turn (head mime.act) |=(=term (cord term))))))
      :_  this
      %+  give-simple-payload:app:server
        eyre-id.act
      ^-  simple-payload:http
      :-  :-  200
          ::  XX send FQSP in headers
          :~  ['Content-Type' mim-cord]
          ==
      %-  some
      +.mime.act
    ==
    ::
    ++  handle-http
      |=  [eyre-id=@ta =inbound-request:eyre]
      ^-  (quip card _state)
      =+  send=(cury response:schooner eyre-id)
    ::
      ?+    method.request.inbound-request
          [(send [405 ~ [%stock ~]]) state]
          %'PUT'
        =/  line  (parse-request-line:server url.request.inbound-request)
        =/  mime  (~(get by (malt args.line)) 'mime')
        ?~  mime
          [(send [400 ~ [%plain "No MIME type provided"]]) state]
        =/  name  (~(get by (malt args.line)) 'name')
        ?~  name
          [(send [400 ~ [%plain "No filename provided"]]) state]
        =/  body  body.request.inbound-request
        ?~  body
          [(send [400 ~ [%plain "No data received"]]) state]
        ::  XX could use +stab if cord started with '/'
        =/  nym  (cut-path value.u.name '.')
        =/  ext  (rear nym)
        =/  mim  ((type-to-mime ext) ((noun-to-type ext) q.u.body))
        :_  state
        ::  XX is there a gift at /call/back/path?
        :~  :*  %pass  ~
                %grow  (tail site.line)
                [%mime mim]
            ==
        ==
      ::
          %'DELETE'
        [(send [405 ~ [%stock ~]]) state]
      ::
          %'GET'
        ~&  >  "Got GET"
        ~&  >  "eyre-id {<eyre-id>}"
        ::  ~&  >>  inbound-request
        =/  line  (parse-request-line:server url.request.inbound-request)
        =/  pax   (~(get by (malt args.line)) 'path')
        ?~  pax
          ~&  >>>  "No data received"
          [(send [400 ~ [%plain "No data received"]]) state]
        =/  =path  (cut-path value.u.pax '/')
        ~&  >  path
        ::  ~&  >>  sky.bowl
        =/  =ship  `@p`(slav %p (head path))
        ?:  =(ship our.bowl)
          ::
          ::  our path
          ~&  >  "Local request"
          =/  ver  (~(get by sky.bowl) (tail path))
          ?~  ver
            ~&  >>>  "No versions of this file"
            [(send [404 ~ [%plain "Not found"]]) state]
          ~&  >  "There is/was a version of this file"
          =/  on-path  ((on @ud (pair @da (each page @uvI))) lte)
          ::  XX i think +ram is getting latest date
          ::     but check this works as expected
          =/  neu  (ram:on-path (need ver))
          ?~  neu
            ~&  >>>  "Not found"
            ::  nothing here
            [(send [404 ~ [%plain "Not found"]]) state]
          ~&  >  "Found something"
          ?.  -.q.val.u.neu
            ::  tombstoned
            ~&  >>>  "Tombstoned"
            [(send [410 ~ [%plain "Gone"]]) state]
          ~&  >  "Not tombstoned"
          ?>  ?=(page p.q.val.u.neu)
          ~&  >  "It's a page"
          =/  =mime  (mime q.p.q.val.u.neu)
          =/  mim-cord
            (crip (tape (join '/' (turn (head mime) |=(=term (cord term))))))
          ~&  >  "Returning response"
          :_  state
          ^-  (list card)
          %+  give-simple-payload:app:server
            eyre-id
          ^-  simple-payload:http
          :-  :-  200
              ::  XX form real FQSP
              :~  ['Content-Type' mim-cord]
                  ['X-FQSP' '~zod/foo']
              ==
          (some +.mime)
        ::
        ::  foreign path
        ~&  >   "Sending request to {<ship>} for {<(tail path)>}"
        ~&  >>  eyre-id
        ~&  >>  /foo/poke/[eyre-id]
        :_  state
        :~  :*  %pass
                /foo/poke/[eyre-id]
                %agent
                [our.bowl %seer]
                %poke
                %foo-poke
                !>([eyre-id path])
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
      [%foo %poke @ ~]
    =/  eyre-id=@ta  i.t.t.wire
    ~&  >>  eyre-id
    ?+  -.sign
      (on-agent:def wire sign)
    ::
        %poke-ack
      ?~  p.sign
        ~&  >  "Got ack from {<src.bowl>}"
        `this
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
      =/  htm  '<!DOCTYPE html><html><head><title>404 Not Found</title></head><body><h1>404 Not Found</h1></body></html>'
      %-  some
      :-  (met 3 htm)
      htm
    ::
    ==
  ==
++  on-fail   on-fail:def
--
