// i take no responsibility for anything you do with this. may god help your soul.
var express = require('express');
var vhost = require('vhost');
var fs = require("fs");
var https = require('https');
var tls = require("tls");
var cors = require('cors');

var appWhatever = express();
appWhatever.use(cors())


const siteWhatever = {
  app: appWhatever,
  context: tls.createSecureContext({
        key: fs.readFileSync('./certs/whatever.key'),
        cert: fs.readFileSync('./certs/whatever.crt'),
    })


};
// repeat as necessary for each site

var sites = {
  "www.whatever.com": siteWhatever,
  "whatever.com": siteWhatever,
};
// add each site here as needed



// stole and reconfigured most of the following code from various sources. 
var exp = express();
for (let s in sites) {
  console.log("http -> " + s);
  exp.use(vhost(s, sites[s].app));
}

var secureOpts = {
  SNICallback: function(domain, cb) {
    console.log('request for: ', domain);
    cb(null, sites[domain].context);
  },
  key: fs.readFileSync('./certs/default.key').toString(),
  cert: fs.readFileSync('./certs/default.crt').toString() // a fallback is needed for whatever reason? i dunno man
};

var httpsServer = https.createServer(secureOpts, exp);

var redirector = express();

redirector.use(function(req, res) {
    res.redirect('https://' + req.headers.host + req.originalUrl);
}); // redirects requests from http to https because why wouldn't you in 2024

redirector.listen(80, function () {
   console.log("Listening https on port: 80")
});
httpsServer.listen(443, function () {
   console.log("Listening https on port: 443")
});
