open Helpers

let parseInput = splitLines >> List.map int

let part1 =
  List.windowed 2
  >> List.filter (fun (w: int list) -> w.[0] < w.[1])
  >> List.length

let part2 =
  List.windowed 3
  >> List.windowed 2
  >> List.filter (fun (w: int list list) -> List.sum w.[0] < List.sum w.[1])
  >> List.length
