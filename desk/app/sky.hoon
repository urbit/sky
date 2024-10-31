/+  dbug, default-agent, verb
|%
+$  versioned-state
  $%  state-0
  ==
::  XX dummy state
+$  state-0
  $:  %0
      values=(list @)
  ==
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
  `this
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
  `this
::
++  on-peek
  |=  path=(pole knot)
  ^-  (unit (unit cage))
  ``*cage
  ::  ?+    path  (on-peek:def path)
  ::    [%x %value idx=@ ~]  [~ ~ [%noun !>((snag idx.path values))]]
  ::    [%x %values ~]  [~ ~ [%noun !>(values)]]
  ::  ==
++  on-watch
  |=  path=(pole knot)
  ^-  (quip card _this)
  `this
++  on-arvo
  |=  [=wire =sign-arvo]
  ^-  (quip card _this)
  `this
  ::  ?+    sign-arvo  (on-arvo:def [wire sign-arvo])
  ::      [%eyre %bound *]
  ::    ?:  accepted.sign-arvo
  ::      %-  (slog leaf+"/apps/{(trip dap.bowl)} bound successfully!" ~)
  ::      [~ this]
  ::    %-  (slog leaf+"Binding /apps/{(trip dap.bowl)} failed!" ~)
  ::    [~ this]
  ::  ==
++  on-leave  on-leave:def
++  on-agent  on-agent:def
++  on-fail   on-fail:def
--

