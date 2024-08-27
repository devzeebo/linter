import fs from "fs"

const fn = () => {
  const text = fs.readFileSync('blah.txt');

  console.log("text: " + text)
}

console.log(fn);

export default fn;