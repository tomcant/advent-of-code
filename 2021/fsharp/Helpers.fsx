module List =
  let rec permutations =
    function
    | [] -> seq [ List.empty ]
    | x :: xs -> Seq.collect (insertions x) (permutations xs)

  and insertions x =
    function
    | [] -> [ [ x ] ]
    | (y :: ys) as xs ->
      (x :: xs)
      :: (List.map (fun x -> y :: x) (insertions x ys))

let splitOn (sep: string) (str: string) = str.Split sep |> Array.toList

let splitLines str = splitOn "\n" str

let splitGroups str = splitOn "\n\n" str

let charToInt (c: char) = int c - int '0'

let msb n =
  Seq.initInfinite (fun i -> i + 1)
  |> Seq.find (fun i -> 1 <<< i >= n)

let debug obj =
  printfn "%A" obj
  obj
