# Regular Expressions I Have Known and Loved


## Title Case Heuristic

**Expression:** `\p{Lu}\p{Ll}+(?:(( [a-z]{2,3}){1,2})? \p{Lu}\p{Ll}+)+`

Captures title-case-like substrings such as
- `The Magic Circle of Social Relation and Abstract Reality`
- `Bob Ross`
