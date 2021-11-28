open Helpers

let parseInput = id

let generateHashes prefix =
  Seq.initInfinite (fun idx -> md5 $"{prefix}{idx}")

let part1 prefix =
  generateHashes prefix
  |> Seq.findIndex (fun hash -> hash.StartsWith("00000"))

let part2 prefix =
  generateHashes prefix
  |> Seq.findIndex (fun hash -> hash.StartsWith("000000"))
