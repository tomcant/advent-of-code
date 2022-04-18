open Helpers

let parseInput = splitOn "," >> List.map int

let findCheapest costFn crabs =
  crabs
  |> List.map (fun pos ->
    crabs
    |> List.sumBy (fun p -> costFn (abs (pos - p))))
  |> List.min

let part1 = findCheapest id
let part2 = findCheapest (fun n -> n * (n + 1) / 2)
