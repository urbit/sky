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
%+  verb  |
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
  ++  on-watch
    |=  =path
    ^-  (quip card _this)
    =^  cards  state  abet:(watch:hc path)
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
  ==
::
++  handle-http
  |=  [eyre-id=@ta =inbound-request:eyre]
  ^+  that
  =/  ,request-line:server
    (parse-request-line:server url.request.inbound-request)
  ::
  ?+    method.request.inbound-request  that
      %'GET'
    ?+  site  that
        [%group @ ~]
      =/  group  (~(get by groups) [our.bowl +6:site])
      ?~  group  
        =/  =response-header:http
          :-  404
          :~  ['Access-Control-Allow-Origin' '*']
              ['Content-Type' 'text/html']
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
        :~  ['Access-Control-Allow-Origin' '*']
            ['Content-Type' 'text/html']
        ==
      =/  group-scry
        .^(group:g %gx /(scot %p our.bowl)/groups/(scot %da now.bowl)/groups/(scot %p our.bowl)/[+6:site]/noun)
      ::  check if in fleet and not publisher 
    ::   =/  joining
    ::     ?&
    ::       (~(has by fleet.group-scry) src.bowl)
    ::       ?!  =(our.bowl src.bowl)
    ::     ==
      =/  data  
        %-  as-octs:mimes:html 
        %-  crip 
        %-  en-xml:html 
        %:  view  
            -:site  
            group-scry
            authenticated.inbound-request
        ==
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
++  agent
  |=  [=wire =sign:agent:gall]
  ^+  that
  ?+    wire  that
      [%sub %groups ~]
    ?+  -.sign  that
        %watch-ack  that
      ::
        %fact
      ?>  ?=(%group-previews p.cage.sign)
      =/  previews  !<(previews:g q.cage.sign)
      ::  remove public/private groups that don't exist anymore from eyre bindings
      =/  remove-binding=(list card)
        %+  murn  ~(tap by previews)
        |=  [p=flag:g q=preview:g]
        ?:  (~(has by previews) p)  ~
        ~&  >>  :-  'removing eyre binding to'  p
        `[%pass /eyre/connect/[q.p] %arvo %e %disconnect `/group/[q.p]]
      =/  bindings=(map binding:eyre [duct action:eyre])
        %-  malt
        %+  turn
          .^((list [binding:eyre duct action:eyre]) %e /(scot %p our.bowl)/bindings/(scot %da now.bowl))
        |=  [=binding:eyre =duct =action:eyre]
        [binding [duct action]]
      =/  bind=(list card)
        %+  murn  ~(tap by previews)
        |=  [p=flag:g q=preview:g]
        ?.
          ::  don't bind groups if they're secret, or if we've already bound them
          ?&  !(~(has by groups) p)
              !secret.q
              !(~(has by bindings) `binding:eyre`[~ ['group' (scot %tas q.p) ~]])
          ==
            ~
          `[%pass /eyre/connect/[q.p] %arvo %e %connect `/group/[q.p] dap.bowl]
      =.  groups  previews
      %-  emil
      %+  welp  
        remove-binding
      bind
      ::
        %kick
      %-  emit
      [%pass /re-sub %arvo %b %wait (add now.bowl ~m1)]
    ==
  ==
::
++  arvo 
  |=  [=wire =sign-arvo]
  ^+  that
  ?+  wire  that
      [%re-sub ~]
    ?>  ?=([%behn %wake *] sign-arvo)
    ?~  error.sign-arvo
      %-  emit
      [%pass /sub/groups %agent [our.bowl %groups] %watch /gangs/index/(scot %p our.bowl)]
    that
  ==
::
++  watch
  |=  =path
  ^+  that  that
::
::
++  view 
  |=  [name=@tas =group:g authenticated=?]
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
  =/  access=tape  (access-type -.cordon.group)
  =/  infleet  (~(has by fleet.group) src.bowl)
  ::
  ^-  manx
  ;html
      ;head
        ;meta(charset "utf-8");
        ;style: {style}
      ==
    ;body
      ;div.fc.p2.background
      =style  "{css-cover} border-radius: 8px;"
        ;div.fr.g1
          ;div.fc.background
          =style  "{css-image} border-radius: 8px; width: 100px; height: 100px;"
            ;p.m2
            =style  "color: white;"
            ;  {(trip title.meta.group)}
            ==
          ==
          ;div.fc
            ;p.m2:  Participants: {<(lent ~(tap by fleet.group))>}
            ;p.m2:  {access}
            ;p.m2:  {(trip description.meta.group)}
          ==
        ==
        ;+ 
          ?:  &(authenticated !infleet)
            ;button.p2
              ;span:  Join
            ==
          ;button.p2
            ;span:  Visit group
          ==
      ==
    ==
  ==
::
++  access-type
  |=  policy=@tas
  ?+  policy  "Undefined"
    %shut  "Private"
    %afar  "Secret"
    %open  "Public"
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
      .background{
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
      }
    '''
::
--