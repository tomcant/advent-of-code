let parseInput = id

let origin = 0, 0
let initialHouses = Set.ofList [ origin ]

let move (x, y) =
  function
  | '^' -> x, y + 1
  | '>' -> x + 1, y
  | 'v' -> x, y - 1
  | _ -> x - 1, y

let part1 directions =
  let _, houses =
    ((origin, initialHouses), directions)
    ||> Seq.fold
          (fun (santa, houses) dir ->
            let next = move santa dir
            (next, houses.Add(next)))

  houses.Count

let part2 directions =
  let _, _, houses, _ =
    ((origin, origin, initialHouses, 0), directions)
    ||> Seq.fold
          (fun (santa, robo, houses, idx) dir ->
            let (nextSanta, nextRobo) =
              match idx % 2 with
              | 0 -> move santa dir, robo
              | _ -> santa, move robo dir

            let nextHouses = houses.Add(nextSanta).Add(nextRobo)
            nextSanta, nextRobo, nextHouses, idx + 1)

  houses.Count
