let murmurhash3js = require('murmurhash3js');
let async = require('async');
let parameters = require('./params/index.js');
let traverse = require('traverse');

const hash = murmurhash3js[process.arch]

const Fingerprint = setting => {
  const config = {
    parameters: [
      Fingerprint.useragent,
      Fingerprint.acceptHeaders,
      Fingerprint.geoip
    ],
    ...setting
  }

  return (req, res, next) => {
    let components = {}
    config.req = req
    let fingerprint = { hash: null }
    async.eachLimit(
      config.parameters,
      1,
      (parameter, callback) => {
        parameter.bind(config)((err, obj) => {
          Object.keys(obj).forEach(key => {
            components[key] = obj[key]
          })
          callback(err)
        })
      },
      err => {
        if(!err) {
          let leaves = traverse(components).reduce(function(acc, x) {
            if (this.isLeaf) acc.push(x)
            return acc
          }, [])
          fingerprint.hash = hash.hash128(leaves.join('~~~'))
          fingerprint.components = components // debug
          req.fingerprint = fingerprint
        }
        next()
      }
    )
  }
}

Object.keys(parameters).forEach(key => {
  Fingerprint[key] = parameters[key]
})

exports = module.exports = Fingerprint