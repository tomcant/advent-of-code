open Helpers

let parseInput = splitLines >> List.map (splitIntsOn "x")

let part1 =
  List.map
    (fun (d: int list) ->
      let areas =
        [ d.[0] * d.[1]
          d.[0] * d.[2]
          d.[1] * d.[2] ]

      List.sum areas * 2 + List.min areas)
  >> List.sum

let part2 =
  List.map
    (fun (d: int list) ->
      let sides =
        [ d.[0] + d.[1]
          d.[0] + d.[2]
          d.[1] + d.[2] ]

      List.min sides * 2 + d.[0] * d.[1] * d.[2])
  >> List.sum
