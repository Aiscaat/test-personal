const app = require('express')();
const http = require('http').Server(app);
var bodyParser = require('body-parser');
const cors = require('cors');


app.use(cors());
app.use(bodyParser.json());

require('./routes.js')(app);

app.get('/', (res) => {
   res.send('Server is work');
})

let port = 3200;

http.listen(port, function () {
   console.log('app running on port ' + port);
})