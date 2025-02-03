|%
::
+|  %types
::
::  XX feels bad; remove
++  ext-to-sample
  |=  =term
  ?+  term  !!
    %txt  wain
  ==
::
++  ext-to-mime
  |=  =term
  ^-  cord
  ?+  term  !!
    %txt  'text/html'
  ==
::
+|  %parsers
::
++  cut-path
  |=  [=cord sep=@t]
  ^-  path
  %+  murn
    p:(need q:((cook |=(a=(list wain) a) (more (jest sep) (star ;~(less (jest sep) next)))) [[1 1] (trip cord)]))
  |=  =wain
  ^-  (unit term)
  ?:  =('' wain)
    ~
  %-  some
  (term (crip wain))
--
