/+  dbug, default-agent, verb
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
::  XX turn verb off in production
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
++  on-save   !>(state)
++  on-load
  |=  old=vase
  ^-  (quip card _this)
  :-  ~
  %=  this
    state  !<(state-0 old)
  ==
++  on-poke
  ::  XX bind a desk we've published, error if URL already taken
  ::  XX bind a desk we've published, overwrite existing URL
  ::  |=  [=mark =vase]
  ::  ^-  (quip card _this)
  on-poke:def
::
++  on-peek   on-peek:def
++  on-watch  on-watch:def
++  on-arvo   on-arvo:def
++  on-leave  on-leave:def
++  on-agent
  |=  [=wire =sign:agent:gall]
  ^-  (quip card _this)
  ?+      -.sign
        ~_  leaf/"Unexpected {<-.sign>} to {<dap.bowl>} on {<wire>}"
        !!
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
    ?+      mark
          ~_  leaf/"Unexpected mark {<mark>}"
          !!
        %sovereign-update-0
      =/  upd  !<(sovereign-update vase)
      ?-  -.upd
          %ini
        :_  this
        ::  XX check if URL exists, error if so
        %+  turn
          ~(tap by +.upd)
        |=  [=desk =treaty]
        ^-  card
        :*  %pass  /bind  %arvo  %e
            %set-response  (cat 3 '/' `@t`desk)
            ~  %.n  %payload
            [200 ['Content-Type' 'text/html; charset=utf-8']~]
            ::  XX publish treaty info to page
            `(as-octs:mimes:html (crip "{<our.bowl>}/{<`@t`desk>}"))
        ==
      ::
          %add
        :_  this
        ::  XX check if URL exists, error if so
        :~  :*  %pass  /bind  %arvo  %e
                %set-response  (cat 3 '/' `@t`desk.upd)
                ~  %.n  %payload
                [200 ['Content-Type' 'text/html; charset=utf-8']~]
                ::  XX publish treaty info to page
                `(as-octs:mimes:html (crip "{<our.bowl>}/{<`@t`desk.upd>}"))
            ==
        ==
      ::
          %del
        :_  this
        :~  :*  %pass  /bind  %arvo  %e
                %set-response  [(cat 3 '/' `@t`desk.upd) ~]
            ==
        ==
      ==
    ==
  ==
++  on-fail   on-fail:def
--

