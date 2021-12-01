let splitOn (sep: string) (str: string) = str.Split sep |> Array.toList

let splitLines str = splitOn "\n" str

let debug obj = printfn "%A" obj
