open System.Security
open System.Text

let splitOn char (str: string) = str.Split [| char |] |> Array.toList

let splitIntsOn char str = splitOn char str |> List.map int

let splitLines str = splitOn '\n' str

let isMatch pattern str =
  RegularExpressions.Regex.IsMatch(str, pattern)

let matches pattern str =
  [ for group in
      RegularExpressions
        .Regex
        .Match(
          str,
          pattern
        )
        .Groups -> group.Value ]
  |> List.tail

let md5 (str: string) =
  use hasher = Cryptography.MD5.Create()

  str
  |> Encoding.UTF8.GetBytes
  |> hasher.ComputeHash
  |> Seq.map (sprintf "%02x")
  |> Seq.reduce (+)
