open Helpers

let parseInput =
  splitGroups
  >> (fun groups ->
    groups.[0] |> splitOn "," |> List.map int,
    groups.[1..]
    |> List.map (
      splitLines
      >> List.map (
        splitOn " "
        >> List.filter (fun s -> s.Length > 0)
        >> List.map int
      )
    ))

let applyNum num =
  List.map (List.map (fun v -> if v = num then 0 else v))

let hasEmptyRow = List.exists (fun row -> List.sum row = 0)

let isWin board =
  (||) (hasEmptyRow board) (hasEmptyRow (List.transpose board))

let scoreBoard = (List.map List.sum) >> List.sum

let part1 (nums, boards) =
  ((0, boards), nums)
  ||> List.fold (fun (result, boards) num ->
    if result > 0 then
      result, []
    else
      let nextBoards = boards |> List.map (applyNum num)
      let winningBoards = nextBoards |> List.filter isWin

      if winningBoards.Length > 0 then
        num * scoreBoard winningBoards.[0], []
      else
        0, nextBoards)
  |> fst

let part2 (nums, boards) =
  (([], boards), nums)
  ||> List.fold (fun (scores, boards) num ->
    let appliedBoards = boards |> List.map (applyNum num)

    let nextScores =
      appliedBoards
      |> List.filter isWin
      |> List.map (fun board -> num * scoreBoard board)
      |> List.append scores

    let nextBoards = appliedBoards |> List.filter (isWin >> not)

    nextScores, nextBoards)
  |> (fun (scores, _) -> List.last scores)
