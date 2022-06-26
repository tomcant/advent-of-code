open Helpers

let parseInput = splitLines

let openBrackets = [ '('; '['; '{'; '<' ]
let closeBrackets = [ ')'; ']'; '}'; '>' ]

let bracketPairs =
  Map(List.append (List.zip openBrackets closeBrackets) (List.zip closeBrackets openBrackets))

let isOpenBracket bracket = List.contains bracket openBrackets

let parseLine line =
  ((None, []), line)
  ||> Seq.fold (fun (badBracket, stack) bracket ->
    if badBracket <> None then
      (badBracket, stack)
    elif isOpenBracket bracket then
      (None, [ bracket ] @ stack)
    elif List.head stack <> bracketPairs.[bracket] then
      (Some(bracket), stack)
    else
      (None, List.tail stack))

let part1 lines =
  let points = Map(List.zip closeBrackets [ 3; 57; 1197; 25137 ])

  lines
  |> List.map parseLine
  |> List.sumBy (fun (bracket, _) ->
    match bracket with
    | Some (b) -> points.[b]
    | None -> 0)

let part2 lines =
  let points = Map(List.zip openBrackets [ 1L; 2L; 3L; 4L ])

  lines
  |> List.map parseLine
  |> List.filter (fun (bracket, _) -> bracket = None)
  |> List.map (fun (_, stack) ->
    (0L, stack)
    ||> List.fold (fun score bracket -> 5L * score + points.[bracket]))
  |> List.sort
  |> (fun l -> l.[l.Length / 2])
