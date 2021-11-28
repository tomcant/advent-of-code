let parseInput = id

let part1 input =
  input
  |> Seq.sumBy
       (function
       | '(' -> 1
       | _ -> -1)

let part2 input =
  ((0, 0), input)
  ||> Seq.fold
        (fun (floor, idx) char ->
          match floor, char with
          | -1, _ -> -1, idx
          | _, '(' -> floor + 1, idx + 1
          | _ -> floor - 1, idx + 1)
  |> snd
