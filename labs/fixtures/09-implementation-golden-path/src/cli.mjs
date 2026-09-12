import { greeting } from "./greeting.mjs";

const name = process.argv[2];
console.log(name === undefined ? greeting() : greeting(name));
