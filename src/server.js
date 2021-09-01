const express = require('express');
const app = express();
const path = require('path');
const routes = require('./routes/routes');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const morgan = require('morgan');

// setting
app.set('port', process.env.PORT || 1313 );
app.set('views', path.join(__dirname,'views'));
app.set('view engine','ejs');




// middlewares
app.use(express.static(path.join(__dirname, 'public')));  // local files
app.use(express.json());    // para etender lo que viene de las vistas
app.use(express.urlencoded({extended: false}));
// session de express para que funcione falsh messages
app.use(session({
    secret: 'merluza_negra',
    resave: false,
    saveUninitialized: true
}))
//app.use(flash({ sessionKeyName: 'flashMessage' }));
app.use(flash());
// passport
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan('dev'));



// rutas
app.use('/', routes );


// running
app.listen(app.get('port'), (req, res) => {
    console.log('Server UP on port: ', app.get('port') );
})