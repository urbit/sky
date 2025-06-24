=,  format
|_  paz=(list path)
++  grab
  |%
  ++  noun  (list path)
  --
++  grow
  |%
  ++  noun  paz
  ++  mime  [/application/json (as-octs:mimes:html (en:json:html json))]
  ++  json
    %-  frond:enjs
    :-  'paths'
    :-  %a
    %+  turn
      paz
    |=  =path
    [%s (spat path)]
  --
++  grad  %noun
--
