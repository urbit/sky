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
  ~&  >  "%aero initialized successfully."
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
      %foo-poke
    =/  act  !<(* vase)
    `this
  ==
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
  `this
++  on-leave  on-leave:def
++  on-agent
  |=  [=wire =sign:agent:gall]
  ^-  (quip card _this)
  `this
++  on-fail   on-fail:def
--
