open Helpers

let parseInput = splitLines

let part1 =
  List.countBy
    (fun str ->
      isMatch "[aeiou].*[aeiou].*[aeiou]" str
      && isMatch "(.)\1" str
      && not <| isMatch "(ab|cd|pq|xy)" str)
  >> List.item 1
  >> snd

let part2 =
  List.countBy (fun str -> isMatch "(..).*\1" str && isMatch "(.).\1" str)
  >> List.item 1
  >> snd
