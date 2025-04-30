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
      %foo-poke
    =/  act  !<(* vase)
    `this
  ==
::
++  on-peek
  |=  =(pole knot)
  ^-  (unit (unit cage))
  ?+  pole
    (on-peek:def pole)
  ::
      [%x %eyre %paths =care:clay und=*]
    ::
    ::  XX take care into account
    =/  cached-paths
      ^-  (list cord)
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
    =/  bound-paths
      ^-  (list cord)
      %+  turn
        .^  (list [binding:eyre duct action:eyre])
            %e
            /(scot %p our.bowl)/bindings/(scot %da now.bowl)
        ==
      |=  [=binding:eyre duct action:eyre]
      (spat path.binding)
    =/  filtered
      ^-  (list cord)
      %+  murn
        (welp bound-paths cached-paths)
      |=  =cord
      ^-  (unit @t)
      ?.  =(0 (lent (fand "@" (trip cord))))
        ~
      ?.  =(((list knot) und.pole) (scag (lent und.pole) (stab cord)))
        ~
      (some cord)
    ::
    ``[%sky-urls !>(filtered)]
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
