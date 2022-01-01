open Helpers

let parseInput =
  splitLines
  >> List.map (
    splitOn " -> "
    >> List.map (
      splitOn ","
      >> List.map int
      >> (fun p -> p.[0], p.[1])
    )
    >> (fun p -> p.[0], p.[1])
  )

let add (x1, y1) (x2, y2) = x1 + x2, y1 + y2

let dir (x1, y1) (x2, y2) =
  if x1 = x2 then
    if y1 < y2 then 0, 1 else 0, -1
  elif y1 = y2 then
    if x1 < x2 then 1, 0 else -1, 0
  elif x1 < x2 then
    if y1 < y2 then 1, 1 else 1, -1
  elif y1 < y2 then
    -1, 1
  else
    -1, -1

let rec line (p1, p2) =
  if p1 = p2 then
    [ p2 ]
  else
    p1 :: line (add p1 (dir p1 p2), p2)

let countOverlaps points =
  (Map [], points)
  ||> List.fold
        (fun map point ->
          match map.TryGetValue point with
          | (true, count) -> map.Add(point, (count + 1))
          | (false, _) -> map.Add(point, 1))
  |> Map.filter (fun _ count -> count > 1)
  |> Map.count

let part1 points =
  points
  |> List.filter (fun ((x1, y1), (x2, y2)) -> x1 = x2 || y1 = y2)
  |> List.collect line
  |> countOverlaps

let part2 points =
  points |> List.collect line |> countOverlaps
