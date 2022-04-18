open Helpers

type HeightMap = int list list

let parseInput =
  splitLines
  >> List.map (Seq.toList >> (List.map charToInt))

let adjacentPoints (x, y) (map: HeightMap) =
  [ (1, 0); (0, 1); (-1, 0); (0, -1) ]
  |> List.map (fun (dx, dy) -> x + dx, y + dy)
  |> List.filter (fun (x, y) ->
    x >= 0
    && y >= 0
    && x < map.[0].Length
    && y < map.Length)

let isLowPoint (x, y) map =
  adjacentPoints (x, y) map
  |> List.forall (fun (xAdj, yAdj) -> map.[y].[x] < map.[yAdj].[xAdj])

let isHighPoint (x, y) (map: HeightMap) = map.[y].[x] = 9

let findBasinSize start map =
  let rec search queue visited =
    if List.length queue = 0 then
      Set.count visited
    else
      let head = List.head queue
      let tail = List.tail queue

      if Set.contains head visited || isHighPoint head map then
        search tail visited
      else
        let adjPoints = adjacentPoints head map
        let nextQueue = List.append tail adjPoints
        let nextVisited = Set.add head visited
        search nextQueue nextVisited

  search [ start ] (Set [])

let part1 map =
  map
  |> List.mapi (fun y row ->
    row
    |> List.mapi (fun x height ->
      if isLowPoint (x, y) map then
        height + 1
      else
        0))
  |> List.concat
  |> List.sum

let part2 map =
  map
  |> List.mapi (fun y row ->
    row
    |> List.mapi (fun x _ ->
      if isLowPoint (x, y) map then
        findBasinSize (x, y) map
      else
        0))
  |> List.concat
  |> List.sort
  |> List.rev
  |> List.take 3
  |> List.reduce (*)
