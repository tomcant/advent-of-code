open Helpers

let parseInput input =
  let ages = input |> splitOn "," |> List.map int

  Array.zeroCreate 9
  |> Array.mapi
       (fun i _ ->
         ages
         |> List.filter ((=) i)
         |> List.length
         |> int64)

let rotateLeft arr =
  Array.append (Array.tail arr) [| arr.[0] |]

let simulate days (fish: int64 []) =
  fish
  |> Seq.unfold
       (fun fish ->
         let nextFish =
           fish
           |> Array.updateAt 7 (fish.[0] + fish.[7])
           |> rotateLeft

         Some(Array.sum fish, nextFish))
  |> Seq.item days

let part1 = simulate 80
let part2 = simulate 256
