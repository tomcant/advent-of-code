open Helpers
open System

let digits =
  Map [ ("abcefg", '0')
        ("cf", '1')
        ("acdeg", '2')
        ("acdfg", '3')
        ("bcdf", '4')
        ("abdfg", '5')
        ("abdefg", '6')
        ("acf", '7')
        ("abcdefg", '8')
        ("abcdfg", '9') ]

let segments = [ 'a'; 'b'; 'c'; 'd'; 'e'; 'f'; 'g' ]

let permuteSignal perm signal =
  let map =
    perm
    |> List.mapi (fun i p -> segments.[i], segments.[p])
    |> Map.ofList

  [| for segment in signal -> map.[segment] |]
  |> Array.sort
  |> String

let parseInput =
  splitLines
  >> List.map (
    splitOn " | "
    >> List.map (
      splitOn " "
      >> List.map (Seq.sort >> String.Concat)
    )
    >> (fun p -> p.[0], p.[1])
  )

let part1 input =
  input
  |> List.sumBy (fun (_, display) ->
    display
    |> List.filter (fun (o: string) -> List.contains o.Length [ 2; 3; 4; 7 ])
    |> List.length)

let part2 input =
  input
  |> List.map (fun (signals, display) ->
    [ 0..6 ]
    |> List.permutations
    |> Seq.find (fun perm ->
      signals
      |> List.forall (permuteSignal perm >> digits.ContainsKey))
    |> (fun perm ->
      display
      |> List.map (permuteSignal perm)
      |> List.map (fun signal -> digits.[signal])
      |> (Array.ofList >> String >> int)))
  |> List.sum
