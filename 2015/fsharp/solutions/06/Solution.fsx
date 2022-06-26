open Helpers

type Action =
  | TurnOn
  | TurnOff
  | Toggle

let parseInput =
  splitLines
  >> List.map (fun line ->
    let m = matches "(.+) (\d+),(\d+) through (\d+),(\d+)" line

    let action =
      match m.[0] with
      | "turn on" -> TurnOn
      | "turn off" -> TurnOff
      | _ -> Toggle

    let coords = List.tail m |> List.map int
    action, (coords.[0], coords.[1]), (coords.[2], coords.[3]))

let genGrid instructions =
  [ 0..999_999 ]
  |> List.map (fun idx ->
    let x = idx % 1000
    let y = idx / 1000

    instructions
    |> List.filter (fun (_, (x1, y1), (x2, y2)) -> x >= x1 && x <= x2 && y >= y1 && y <= y2)
    |> List.map (fun (action, _, _) -> action))

let part1 =
  genGrid
  >> List.map (
    List.fold
      (fun state ->
        function
        | TurnOn -> true
        | TurnOff -> false
        | Toggle -> not state)
      false
  )
  >> List.filter id
  >> List.length

let part2 =
  genGrid
  >> List.map (
    List.fold
      (fun brightness ->
        function
        | TurnOn -> brightness + 1
        | TurnOff -> max 0 (brightness - 1)
        | Toggle -> brightness + 2)
      0
  )
  >> List.sum
