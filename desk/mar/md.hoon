::
::::  /hoon/md/mar
  ::
/?    310
::
=,  format
=,  mimes:html
|_  txt=wain
::
++  grab                                                ::  convert from
  |%
  ++  mime  |=((pair mite octs) (to-wain q.q))
  ++  noun
    |=  n=*
    ^-  wain
    ?^  n
      (wain n)
    (to-wain n)
  --
++  grow
  |%
  ++  mime  [/text/plain (as-octs (of-wain txt))]
  --
++  grad  %mime
--
