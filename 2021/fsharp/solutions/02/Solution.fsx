open Helpers

let parseInput =
  splitLines
  >> List.map (splitOn " " >> (fun p -> p.[0], int p.[1]))

let part1 =
  List.fold
    (fun (x, depth) (dir, by) ->
      match dir with
      | "up" -> x, depth - by
      | "down" -> x, depth + by
      | _ -> x + by, depth)
    (0, 0)
  >> fun (x, depth) -> x * depth

let part2 =
  List.fold
    (fun (x, depth, aim) (dir, by) ->
      match dir with
      | "up" -> x, depth, aim - by
      | "down" -> x, depth, aim + by
      | _ -> x + by, depth + aim * by, aim)
    (0, 0, 0)
  >> fun (x, depth, _) -> x * depth
