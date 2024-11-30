// fill in the blanks yourself this is just the main logic code
var sessionid = ""

function resetSession () {
  request('https://inkbunny.net/api_login.php?username=username&password=password', function (error, response, body) {
    sessionid = JSON.parse(body)['sid']
  });
}

var appInkbunny = express()
appInkbunny.use(express.static('resources/inkbunny.cafe'));

appInkbunny.set('view engine', 'ejs');

appInkbunny.get('/', function(req, res){
   res.render("./pages/inkbunny.cafe/main.ejs");
});

appInkbunny.get('/s/:id', function(req, res){
  request('https://inkbunny.net/api_submissions.php?sid=' + sessionid + '&submission_ids=' + req.params.id, function (error, response, body) {
    try {
    table = JSON.parse(body)["submissions"][0]
    returnopts = {
      title: table["title"],
      url: "https://inkbunny.net/s/" + table["submission_id"].toString(),
      file: table["files"][0]["file_url_full"],
      description: "by " + table["username"] + " on inkbunny"
    }
    res.render('./pages/inkbunny.cafe/result.ejs', returnopts);
  } catch {
    if (res.status != 500) {
      res.status(500)
      res.send("something fucked up")
    }}
  });
});


resetSession()
cron.schedule('0 */6 * * *', () => {
  resetSession()
});
