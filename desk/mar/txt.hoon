|_  txt=@t
++  grow                                                ::  convert to
  ^?
  |%                                                    ::
  ++  mime  [/text/plain (met 3 txt) txt]                ::  to %mime
  --                                                    ::
++  grab  ^?
          |%                                            ::  convert from
          ++  noun  @t                                  ::  clam from %noun
          ++  mime  |=([p=mite q=octs] q.q)             ::  retrieve form %mime
          --
++  grad  %mime
--
