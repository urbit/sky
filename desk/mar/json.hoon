|_  json=@t
++  grow                                                ::  convert to
  ^?
  |%                                                    ::
  ++  mime  [/text/markdown (met 3 json) json]                ::  to %mime
  --                                                    ::
++  grab  ^?
          |%                                            ::  convert from
          ++  noun  @t                                  ::  clam from %noun
          ++  mime  |=([p=mite q=octs] q.q)             ::  retrieve form %mime
          --
++  grad  %mime
--
