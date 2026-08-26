import { cp, mkdir, rm } from "node:fs/promises"
import { fileURLToPath } from "node:url"

const source = fileURLToPath(new URL("../tools/literature/dist/", import.meta.url))
const destination = fileURLToPath(new URL("../public/literature/", import.meta.url))

await rm(destination, { recursive: true, force: true })
await mkdir(destination, { recursive: true })
await cp(source, destination, { recursive: true })

console.log("Staged tools/literature/dist at public/literature")
