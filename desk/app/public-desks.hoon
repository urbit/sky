/+  dbug, default-agent, verb
|%
+$  versioned-state
  $%  state-0
  ==
+$  state-0  ~
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
  ::  XX subscribe to desks
  ::  XX publish a binding for any desks we've made public
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
  ::  XX bind a desk we've made public, error if URL already taken
  ::  XX bind a desk we've made public, overwrite existing URL
  ::  |=  [=mark =vase]
  ::  ^-  (quip card _this)
  on-poke:def
::
++  on-peek   on-peek:def
++  on-watch  on-watch:def
++  on-arvo   on-arvo:def
++  on-leave  on-leave:def
++  on-agent
  ::  XX bind a new public desk
  ::  XX un-bind a desk we've made private
  on-agent:def
++  on-fail   on-fail:def
--

