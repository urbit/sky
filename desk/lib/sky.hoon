|%
::
+|  %types
::
::  XX feels bad; remove
++  ext-to-sample
  |=  =term
  ?+    term
      ~_  leaf/"Unsupported filetype {<term>}"
      !!
    %txt   wain
    %js    atom
    %md    wain
    %css   cord
    %html  cord
    %json  json
    %xml   cord
    %pdf   atom
    %gif   atom
    %png   atom
    %jpg   atom
    %jpeg  atom
    %mp3   atom
    %mpeg  atom
    %mp4   atom
  ==
::
++  ext-to-mime
  |=  =term
  ^-  cord
  ?+    term
      ~_  leaf/"Unsupported filetype {<term>}"
      !!
    %css   'text/css'
    %html  'text/html'
    %txt   'text/plain'
    %md    'text/markdown'
    %js    'text/javascript'
    %xml   'application/xml'
    %json  'application/json'
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
