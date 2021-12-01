open Solution
open System.IO

let input =
  fsi.CommandLineArgs.[1]
  |> File.ReadAllText
  |> parseInput

let printAnswer part answer = printfn $"Part {part}: %A{answer}"

input |> (part1 >> printAnswer 1)
input |> (part2 >> printAnswer 2)
