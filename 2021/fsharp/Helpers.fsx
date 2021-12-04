let splitOn (sep: string) (str: string) = str.Split sep |> Array.toList

let splitLines str = splitOn "\n" str

let msb n =
  Seq.initInfinite (fun i -> i + 1)
  |> Seq.find (fun i -> 1 <<< i >= n)

let debug obj = printfn "%A" obj
