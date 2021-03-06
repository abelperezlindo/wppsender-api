/**
 * @file proveedor del servicio
 * 
 */
const config  = require('./config.js');
// Globals variables
global.cronStatus = false;  // Contiene el estado de cron.
global.qr = '';           // Contiene el qr para escanear
global.awaitForQr = false;

const express   = require('express');                   // Servidor web
const task      = require('./src/cron');
const manager   = require('./src/manager');
const helper    = require('./lib/helper');
const { isAbsolute } = require('path');

const app = express();
app.set('port', config.port);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/**
 * Rutas
 */
// get if server is online
app.get('/', async (req, res) => {
    console.log('reqest to /');
    res.setHeader('Content-Type', 'application/json');
    res.json({'status': 'activo'});
})
// Obtener estado de cron.
app.get('/cron', async (req, res) => {
    console.log('reqest');
    res.setHeader('Content-Type', 'application/json');
    res.json({cronStatus: global.cronStatus})
})
// Iniciar cron.
app.get('/cron/start', async (req, res) => {
    console.log('reqest to /cron/start');
    res.setHeader('Content-Type', 'application/json');
    if(global.cronStatus){
        task.start();
        global.cronStatus = true;
    } 
    res.json({cronStatus: global.cronStatus});
});
// Detener cron.
app.get('/cron/stop', async (req, res) => {
    console.log('reqest to /cron/stop');
    res.setHeader('Content-Type', 'application/json');
    if(!global.cronStatus){
        task.stop();
        global.cronStatus = false;
    } 
    res.json({cronStatus: global.cronStatus});
});
// Obtener qr para nueva sesion
app.get('/session/qr', async (req, res) => {
    console.log('reqest to qr');
    console.log('QR is: ', global.qr);
    res.setHeader('Content-Type', 'application/json');

    if(!global.awaitForQr && global.qr.length === 0) {
        // Solicitamos el qr
        global.awaitForQr = true;
        console.log('Creat client');
        manager.createClient();
        //await helper.sleep(1000);
        //res.send('tabueno');
        res.json({
            status: 'loading',
            description: 'Await for qr',
            qr: '',
        }); 
    } else {
        res.json({
            status: 'load',
            description: 'Qr is load',
            qr: global.qr
        });
    }

});


//Start the server
app.listen(app.get('port'), () => {
    console.log('Server escuchando en puerto ', app.get('port'))
    console.log(`http://localhost:${app.get('port')}`);
});



