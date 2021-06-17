const http = require('http');

const PORT = 3000;

const app = http.createServer((req, res) => {

    res.writeHead(200, {"Content-Type":"text/html"});
    res.write("<h1>Hola mundo</h1>");
    res.end();
});

app.listen(PORT);
console.log("Servidor escuchando en el puerto " + PORT);