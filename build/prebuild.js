const fs = require('fs')
const fse = require('fs-extra')
const path = require('path')

const package2files = [
  'background/background.js',
  'background/page.html'
]

const package3files = [
  'background/service_worker.js'
]

const allFiles = [
  'background/rules.js',
  'background/utils.js',
  'LICENSE',
  'icons/*',
  'resources/*',
  'README.md',
  "package.json"
]

let manifestVersion
let packageFiles

if (process.argv.includes('-v2')) {
  manifestVersion = 2
  packageFiles = allFiles.concat(package2files)
} else if (process.argv.includes('-v3')) {
  manifestVersion = 3
  packageFiles = allFiles.concat(package3files)
} else {
  throw new Error('Unknown manifest version')
}

console.log(`Building no-direct-ip with manifest version ${manifestVersion}`)

// delete and create build directory
const buildDir = `./build/v${manifestVersion}/`
if (fs.existsSync(buildDir)) {
  fs.rmSync(buildDir, { recursive: true, force: true })
}
fs.mkdirSync(buildDir, { recursive: true })

for (let i = 0; i < packageFiles.length; i++) {
  let src
  let dst
  if (packageFiles[i].endsWith('/') || packageFiles[i].endsWith('*')) {
    src = packageFiles[i].split('*')[0]
    dst = path.join(__dirname, '../', buildDir, packageFiles[i].split('*')[0])
  } else {
    src = packageFiles[i]
    dst = path.join(
      buildDir, packageFiles[i].replace(path.join(__dirname, '../'), '')
    )
  }

  fse.copy(src, dst, function (err) {
    if (err) throw err
  })
}

fs.readFile('package.json', (err, data) => {
    if (err) throw err;
    let packageJson = JSON.parse(data);
    let manifestJson = require(`../manifest-v${manifestVersion}.json`);
    manifestJson.version = packageJson.version
    fs.writeFileSync(path.join(buildDir, 'manifest.json'), JSON.stringify(manifestJson));
});
