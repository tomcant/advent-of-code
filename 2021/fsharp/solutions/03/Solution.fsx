open Helpers
open System

let parseInput =
  splitLines
  >> List.map (fun line -> Convert.ToInt32(line, 2))

let msb report = report |> List.map msb |> List.max

let mostCommonBit idx report =
  report
  |> List.filter (fun v -> v >>> idx &&& 1 = 1)
  |> List.length
  |> (fun oneCount ->
    match report.Length - oneCount with
    | x when x > oneCount -> Some(0)
    | x when x < oneCount -> Some(1)
    | _ -> None)

let leastCommonBit idx report =
  match mostCommonBit idx report with
  | Some (bit) -> Some(bit ^^^ 1)
  | _ -> None

let calcRate bit report =
  let maxBit = msb report - 1

  [ for i in 0 .. maxBit ->
      match mostCommonBit (maxBit - i) report with
      | Some (b) when b = bit -> 1 <<< maxBit - i
      | _ -> 0 ]
  |> List.sum

let gammaRate report = calcRate 1 report
let epsilonRate report = calcRate 0 report

let powerConsumption report =
  (*) (gammaRate report) (epsilonRate report)

let reduceReport commonBitFn defaultBit report =
  (report, 0)
  |> Seq.unfold
       (fun (state, i) ->
         let idx = msb report - 1 - i

         let commonBit =
           defaultArg (commonBitFn idx state) defaultBit

         let next =
           state
           |> List.filter (fun v -> v >>> idx &&& 1 = commonBit)

         Some(next, (next, i + 1)))
  |> Seq.find (fun l -> l.Length = 1)
  |> Seq.exactlyOne

let oxygenGeneratorRating report = reduceReport mostCommonBit 1 report
let co2ScrubberRating report = reduceReport leastCommonBit 0 report

let lifeSupportRating report =
  (*) (oxygenGeneratorRating report) (co2ScrubberRating report)

let part1 = powerConsumption
let part2 = lifeSupportRating
