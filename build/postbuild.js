const fs = require('fs')
const path = require('path')

let manifestVersion

if (process.argv.includes('-v2')) {
  manifestVersion = 2
} else if (process.argv.includes('-v3')) {
  manifestVersion = 3
} else {
  throw new Error('Unknown manifest version')
}

// delete and create build directory
const buildDir = `./build/v${manifestVersion}/`


fs.readFile('package.json', (err, data) => {
    if (err) throw err;
    let packageJson = JSON.parse(data);

    let oldPath = path.join(buildDir, "no-direct-ip.zip")
    let newPath = path.join(buildDir, `no-direct-ip-v${manifestVersion}-${packageJson.version}.zip`)
    fs.rename(oldPath, newPath, () => {
      console.log(
        "\n==================\nBuilt:",
        newPath,
        "\n------------------"
      )
    })
});
