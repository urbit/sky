/+  dbug, verb, server, schooner, default-agent
|%
+$  versioned-state
  $%  state-0
  ==
+$  state-0  [%0 ~]
+$  card  $+(card card:agent:gall)
--
::
%+  verb  %.n
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
  `this
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
  ?+    mark
    (on-poke:def mark vase)
  ::
  ::  XX %clear-cache
  ::       [%clear-cache (unit path)]
  ::       see %sky on-init for clearing Eyre cache
      %cache
    ::  XX should be an actual type like $aero-cache
    =/  act  !<([url=@t =mime-data:iris] vase)
    ~&  >  "Cacheing {<url.act>}"
    :_  this
    :~  :*  %pass  ~  %arvo  %e
            %set-response  url.act
            %-  some
            ^-  cache-entry:eyre
            :*  %.n
                :-  %payload
                ^-  simple-payload:http
                :_  (some +.mime-data.act)
                :-  200
                :~  ['X-Urbit-Desk' 'Sky']
                    ['Content-Type' -.mime-data.act]
                ==
            ==
        ==
    ==
  ==
::
++  on-peek
  |=  =(pole knot)
  ^-  (unit (unit cage))
  ?+  pole
    (on-peek:def pole)
  ::
      [%x %eyre %paths =care:clay und=*]
    %-  some
    %-  some
    :-  %sky-urls
    !>  ^-  (list cord)
    ::  remove duplicate search results
    %-  roll
    :_  |=  [=cord res=(list @t)]
        ^+  res
        ?:  =(0 (lent (fand [cord]~ res)))
          :-(cord res)
        res
    ::  search results
    %+  murn
      %+  welp
        ::  eyre bindings
        %+  turn
          .^  (list [binding:eyre duct action:eyre])
              %e
              /(scot %p our.bowl)/bindings/(scot %da now.bowl)
          ==
        |=  [=binding:eyre duct action:eyre]
        (spat path.binding)
      ::  eyre cache
      %+  murn
        %~  tap  by
        .^  (map @t [@ud (unit cache-entry:eyre)])
            %e
            /(scot %p our.bowl)/cache/(scot %da now.bowl)
        ==
      |=  [url=@t [aeon=@ud val=(unit cache-entry:eyre)]]
      ?~  val
        ~
      (some url)
    |=  =cord
    ^-  (unit @t)
    ::  filter endpoints with characters that
    ::  @ta doesn't recognise as URL-safe
    ?.  =(0 (lent (fand "@" (trip cord))))
      ~
    ::  get matches
    ?.  =(((list knot) und.pole) (scag (lent und.pole) (stab cord)))
      ~
    ::  apply care
    %-  some
    %-  spat
    %+  scag
      ?+  care.pole
        %-  (slog [[%leaf "aero: forbidden care {<care.pole>}"] ~])
        (on-peek:def pole)
        %x  1
        %y  2
        %z  (lent (stab cord))
      ==
    (stab cord)
  ==
++  on-watch
  ::  XX sticky scry
  |=  path=(pole knot)
  ^-  (quip card _this)
  `this
++  on-agent
  ::  XX should listen to tasks from %seer upon a
  ::     successful %grow, but Gall vane doesn't send
  ::     a gift to confirm that that worked right now
  |=  [=wire =sign:agent:gall]
  ^-  (quip card _this)
  `this
++  on-arvo   on-arvo:def
++  on-leave  on-leave:def
++  on-fail   on-fail:def
--
