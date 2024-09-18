import express from 'express';
import mysql from 'mysql';
import util from 'util';

//FIX para el __dirname
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.set ('port', 4000);

app.listen(app.get('port'), '127.0.0.1', () => {
    console.log('Server on IP 127.0.0.1, port:', app.get('port'));
});

//Configuracion
app.use(express.static(__dirname + "/../../TodasBrillamos"));
// Middleware para servir archivos .br
app.get('*.br', function (req, res, next) {
    res.set('Content-Encoding', 'br');
    next();
});

app.use (express.json());

// Enpoints

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + '/../../TodasBrillamos/src/index.html'));
});