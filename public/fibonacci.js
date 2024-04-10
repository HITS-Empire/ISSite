let i = 0
let a = 1
let b = 1
let c

while (i < n - 2) {
    c = a + b
    a = b
    b = c
    i += 1
}

console.log(b)
