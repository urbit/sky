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
%+  verb  |
%-  agent:dbug
=|  state-0
=*  state  -
^-  agent:gall
=<
|_  =bowl:gall
+*  this  .
    def   ~(. (default-agent this %|) bowl)
    hc    ~(. +> bowl)
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
        %+  turn
          %+  skim  ~(tap by +.upd)
          binding-check:hc
        |=  [=desk =treaty]
          ^-  card
          ~&  >  "binding {</[desk]>}"
          (set-response desk treaty)
      ::
          %add
        :_  this
        ?.  (binding-check:hc [desk.upd ~])  
          ~&  >>  "Can't publish at {</[`@t`desk.upd]>} path, eyre alredy binded"
          ~
        ~&  >  "binding {</[desk]>}"
        :~  (set-response desk.upd treaty.upd)
        ==
      ::
          %del
        :_  this
        ?.  (binding-check:hc [desk.upd ~])  
          ~&  >>  "Can't remove binding at {</[`@t`desk.upd]>} path, binding was set by different agent"
          ~
        :~  
          :*  %pass  /eyre/response/[desk.upd]  %arvo  %e  %set-response  (spat /[`@t`desk.upd])  ~
          ==
        ==
      ==
    ==
  ==
++  on-watch  on-watch:def
++  on-arvo   on-arvo:def
++  on-leave  on-leave:def
++  on-poke   on-poke:def
++  on-peek   on-peek:def
++  on-fail   on-fail:def
--
|_  =bowl:gall
::
::  gate, checks if published desks allowed to bind on path
++  binding-check
  |=  [=desk *]
  ^-  ?
  =/  binding  (~(get by bindings) `binding:eyre`[~ [[`@t`desk] ~]])
  ::  has no binding, will bind to dap.bowl
  ?:  =(binding ~)  &
  =/  =action:eyre  +:(need binding)
  ::  checking if correct type of binding
  ?.  ?=([%app term] action)  
    ~&  >>  ['incorrect type of action:eyre' action]
    |
  ::  has binding, checking if bounded by dap.bowl
  =(app.action dap.bowl) 
::
++  bindings 
  ^-  (map binding:eyre [duct action:eyre])
  =/  bindings  .^((list [binding:eyre duct action:eyre]) %e /(scot %p our.bowl)/bindings/(scot %da now.bowl))
  %-  malt
  %+  turn
    bindings
  |=  [=binding:eyre =duct =action:eyre]
  [binding [duct action]]
::
++  headers 
  ^-  response-header:http
  :-  200
  :~  ['Access-Control-Allow-Origin' '*']
      ['Content-Type' 'text/html; charset=utf-8']
  ==
::
++  data 
  |=  docket=docket-0
  =/  color  
    %+  oust  [1 2]
    %+  oust  [4 1] 
    %+  scow  %ux  color.docket
  ^-  (unit octs)
  %-  some
  %-  as-octs:mimes:html 
  %-  crip 
  %-  en-xml:html 
  ^-  manx
  ;html
    ;head
      ;meta(charset "utf-8");
      ;style: {style}
    ==
    ;body
      ;div
      =style  "display: flex; flex-direction: row; align-items: center; gap: 15px;"
        ;div(class "grow")
        ;+  ?:  |(=(~ image.docket) =(`'' image.docket))
            ;div(class "w100 h100 br", style "background:#{color};");
          ;img(src (trip (need image.docket)), class "w100 hf br");
        ==
        ;div
        =style  "display: flex; flex-direction: column;"
          ;h2: {(trip title.docket)}
          ;p: {(trip info.docket)}
          ;a(href "{(trip website.docket)}")
            ; {(trip website.docket)}
          ==
        ==
      ==
      ;a(class "btn br")
        ;span: Install
      ==
    ==
  ==
::
++  body 
  |=  =docket-0
  :-  %payload
  ^-  simple-payload:http
  :-  headers 
  (data docket-0)
::
++  set-response 
  |=  [=desk =treaty]
  =/  bod  (body docket-0.treaty)
  ^-  card
  :*  %pass  /eyre/response/[desk]  %arvo  %e  %set-response  (spat /[desk])  `[| bod]
  ==
::
++  style
%-  trip
'''
@font-face {
  font-family: "Urbit Sans";
  src: url("https://media.urbit.org/fonts/UrbitSans/UrbitSansVFWeb-Regular.woff2")
       format("woff2");
  font-weight: 100 700;
  font-style: normal;
}
body{
  width: 100%; 
  height: 100%; 
  display: flex; 
  justify-content: center; 
  flex-direction: column;
  align-items: center;
  font-family: 'Urbit Sans';
  gap: 8px;
}
h2{
  margin-top: 4px;
  margin-bottom: 4px;
}
a{
  text-decoration: none;
  color: black;
}
img{
  object-fit: cover;
}
.w100{
  width: 100px;
}
.h100 {
  height: 100px;
}
.hf{
  height: 100%;
}
.br{
  border-radius: 8px;
}
.grow {
  flex-grow: 1;
}
.btn{
  background: black;
  color: white;
  padding: 8px;
}
'''
--
