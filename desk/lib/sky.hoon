/$  noun-js    %noun  %js
/$  noun-md    %noun  %md
/$  noun-css   %noun  %css
/$  noun-txt   %noun  %txt
/$  noun-xml   %noun  %xml
/$  noun-html  %noun  %html
/$  noun-json  %noun  %json
::
/$  js-mime    %js    %mime
/$  md-mime    %md    %mime
/$  css-mime   %css   %mime
/$  txt-mime   %txt   %mime
/$  xml-mime   %xml   %mime
/$  html-mime  %html  %mime
/$  json-mime  %json  %mime
::
|%
::
+|  %marks
::
++  noun-to-type
  |=  typ=term
  ?+  typ
      ~_  leaf/"Unsupported type {<typ>}"
      !!
    %md    noun-md
    %js    noun-js
    %css   noun-css
    %txt   noun-txt
    %xml   noun-xml
    %html  noun-html
    ::  %json  noun-json
  ==
::
++  type-to-mime
  |=  typ=term
  ?+  typ
      ~_  leaf/"Unsupported type {<typ>}"
      !!
    %md    md-mime
    %js    js-mime
    %css   css-mime
    %txt   txt-mime
    %xml   xml-mime
    %html  html-mime
    ::  %json  json-mime
  ==
::
+|  %types
::
++  ext-to-mime
  |=  =term
  ^-  cord
  ?+  term
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
