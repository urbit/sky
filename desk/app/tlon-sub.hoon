/-  g=groups
/+  dbug, default-agent, verb, schooner, server
::
|%
+$  versioned-state
  $%  state-0
  ==
+$  state-0
  $:  %0  
      groups=previews:g
  ==
+$  card  $+(card card:agent:gall)
--
=|  state-0
=*  state  -
::
%+  verb  &
%-  agent:dbug
^-  agent:gall
=<
  |_  =bowl:gall
  +*  this  .
      def  ~(. (default-agent this %|) bowl)
      hc   ~(. +> [bowl ~])
  ::
  ++  on-init
    ^-  (quip card _this)
    =^  cards  state  abet:init:hc
    [cards this]
  ::
  ++  on-save
    ^-  vase
    !>(state)
  ::
  ++  on-load
    |=  =vase
    ^-  (quip card _this)
    =^  cards  state  abet:(load:hc vase)
    [cards this]
  ::
  ++  on-poke
    |=  [=mark =vase]
    ^-  (quip card _this)
    =^  cards  state  abet:(poke:hc mark vase)
    [cards this]
  ::
  ++  on-watch
    |=  =path
    ^-  (quip card _this)
    =^  cards  state  abet:(watch:hc path)
    [cards this]
  ::
  ++  on-agent
    |=  [=wire =sign:agent:gall]
    ^-  (quip card _this)
    =^  cards  state  abet:(agent:hc wire sign)
    [cards this]
  ::
  ++  on-arvo
    |=  [=wire =sign-arvo]
    ^-  (quip card _this)
    =^  cards  state  abet:(arvo:hc wire sign-arvo)
    [cards this]
  ::
  ++  on-peek   on-peek:def
  ++  on-fail   on-fail:def
  ++  on-leave  on-leave:def
  --
|_  [=bowl:gall deck=(list card)]
+*  that  .
++  emit  |=(=card that(deck [card deck]))
++  emil  |=(lac=(list card) that(deck (welp (flop lac) deck)))
++  abet  ^-((quip card _state) [(flop deck) state])
::
++  from-self    =(our src):bowl
::
++  init
  ^+  that
  %-  emit 
      [%pass /sub/groups %agent [our.bowl %groups] %watch /gangs/index/(scot %p our.bowl)]
::
++  load
  |=  vaz=vase
  ^+  that
  ?>  ?=([%0 *] q.vaz)
  that(state !<(versioned-state vaz))
::
++  poke
  |=  [=mark =vase]
  ^+  that
  ?+  mark  !!
      %handle-http-request
    (handle-http !<([@ta =inbound-request:eyre] vase))
      %noun 
    =/  name  !<(term vase)
    =/  group  (~(get by groups) [our.bowl name])
    ?~  group  
      ~&  >>>  "Group {<name>} wasn't published from {<our.bowl>}"
      that
    ~&  >  "Publishing {<name>} to /{<our.bowl>}/{<name>}"
    %-  emit
    [%pass /eyre/connect/[q.flag:(need group)] %arvo %e %connect `/[q.flag:(need group)] %tlon-sub]
  ==
::
++  handle-http
  |=  [eyre-id=@ta =inbound-request:eyre]
  ^+  that
  =/  ,request-line:server
    (parse-request-line:server url.request.inbound-request)
  ~&  'got request'
  ~&  >  site
  ::
  ?+    method.request.inbound-request  that
      %'GET'
    ?+  site  that
        [@ ~]
      =/  group  (~(get by groups) [our.bowl -:site])
      ?~  group  
        =/  =response-header:http
          :-  404
          :~  'Access-Control-Allow-Origin'^'*'
              'Content-Type'^'text/html'
          ==
        =/  data  (as-octs:mimes:html '404 Error - Page Not Found')
        %-  emil
        %:  http-response-cards 
            response-header
            eyre-id 
            data
        ==
      =/  =response-header:http
        :-  200
        :~  'Access-Control-Allow-Origin'^'*'
            'Content-Type'^'text/html'
        ==
      =/  data  (as-octs:mimes:html (crip (en-xml:html (view (need group)))))
      %-  emil   
      %:  http-response-cards 
          response-header
          eyre-id 
          data
      ==
    ==
  ==
++  http-response-cards     
  |=  [=response-header:http eyre-id=@ta data=octs]   
  ^-  (list card)
  :~
    [%give %fact [/http-response/[eyre-id]]~ %http-response-header !>(response-header)]
    [%give %fact [/http-response/[eyre-id]]~ %http-response-data !>(`data)]
    [%give %kick [/http-response/[eyre-id]]~ ~]
  ==
::
++  watch
  |=  =path
  ^+  that  
  (emil ~)
::
++  agent
  |=  [=wire =sign:agent:gall]
  ^+  that
  ?+    wire  that
      [%sub %groups ~]
    ?+    -.sign  that
        %watch-ack
      ?~  p.sign
        ((slog 'Subscribe succeeded!' ~) that)
      ((slog 'Subscribe failed!' ~) that)
      ::
        %fact
      ?+    p.cage.sign  that
          %group-previews
        =/  previews  !<(previews:g q.cage.sign)
        =/  hosting=(list (pair flag:g preview:g))
          %+  skim  ~(tap by previews)
          |=  [p=flag:g q=preview:g]
          ::  if has in groups ignore 
          ::  if secret ignore
          ?&  !(~(has by groups) p)
              !secret.q
          ==
        =.  groups  `previews:g`(~(uni by groups) previews)
        %-  emil
        %+  turn  hosting
          |=  [p=flag:g q=preview:g]
          [%pass /eyre/connect/[q.p] %arvo %e %connect `/[q.p] %tlon-sub]
      ==
        %kick
      ~&  'Got kick'
      %-  emit
          [%pass /re-sub %arvo %b %wait (add now.bowl ~m3)]
    ==
  ==
::
++  arvo 
  |=  [=wire =sign-arvo]
  ^+  that
  ?+    wire  that
      [%re-sub ~]
    ?+    sign-arvo  that
        [%behn %wake *]
      ?~  error.sign-arvo
        %-  emit
            [%pass /sub/groups %agent [our.bowl %groups] %watch /gangs/index/(scot %p our.bowl)]
      that
    ==
    ::
      [%eyre %connect @ ~]
    ?>  ?=([%eyre %bound *] sign-arvo)
    ?:  accepted.sign-arvo
      ~&  :-  'bound successfully'  wire
      that
    ~&  :-  'binding failed'  wire
    that
  ==
::
++  view 
  |=  group=preview:g
  =/  image  (trip image.meta.group)
  =/  cover  (trip cover.meta.group)
  =/  css-image  
    ?:  (gth (lent image) 7)
      "background-image: url('{image}');"
    "background: {image};"
  =/  css-cover 
    ?:  (gth (lent cover) 7)
      "background-image: url('{cover}');"
    "background: {cover};"
  ^-  manx
  ;html
      ;head
        ;meta(charset "utf-8");
        ;style: {style}
      ==
    ;body
      ;div.fc.g1.p2
      =style  "{css-cover} border-radius: 8px;"
        ;div.fr.g1
          ;div.fc
          =style  "{css-image} border-radius: 8px; width: 100px; height: 100px;"
            ;p.m2
            =style  "color: white;"
            ;  {(trip title.meta.group)}
            ==
          ==
          ;div.fc
            ;p.m2:  {<p.flag.group>}
            ;p.m2:  status: {(scow %tas -.cordon.group)}
            ;p:  {(trip description.meta.group)}
          ==
        ==
        ;button.p2
          ;span:  join
        ==
      ==
    ==
  ==
::
++  style 
    %-  trip
    '''
      body{
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;  
      }
      button{
        border:none;
        border-radius: 5px;
      }
      .g1 {
        gap: 4px;
      }
      .fc{
        display: flex;
        flex-direction: column;
      }
      .fr{
        display: flex;
        flex-direction: row;
      }
      .m2{
        margin: 8px;
      }
      .p2{
        padding: 8px;
      }
    '''
::
--