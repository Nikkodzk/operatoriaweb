const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const pool = require("./database");
const bcrypt = require("bcryptjs");






// ------------------------------------------------------------------- passport

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const rows = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);
  done(null, rows[0]);
});









// ------------------------------------------------------------------- estrategia inicio sesion NUEVO
/* passport.use('inicio.sesion', new localStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {
  const rows = await pool.query('SELECT * FROM usuarios WHERE username = ?', [username]);
  if (rows.length > 0) {
    const user = rows[0];
    const validPassword = await bcrypt.compareSync(password, user.password)
    if (validPassword) {
      
      done(null, user);
    } else {
      done(null, false, req.flash('info', 'La contraseña es incorrecta'));
    }
  } else {
    return done(null, false, req.flash('info', 'El usuario no está registrado'));
  }
})); */

passport.use('inicio.sesion', new localStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {
  const rows = await pool.query('SELECT * FROM usuarios WHERE username = ?', [username]);
  // si encontró el usuario

  if (rows.length > 0) {
    const user = rows[0];

    // si el usuario esta inhabilitado
    if(user.estado === 'Deshabilitado'){
      done(null, false, req.flash('info', 'Usuario deshabilitado'));
    }
  // si el usuario esta OK
    else{
      // compara contraseñas
    const validPassword = await bcrypt.compareSync(password, user.password)

    // si la password es OK
    if (validPassword) {
      done(null, user);
    } 
    // si no coincide la assword
    else {
      done(null, false, req.flash('info', 'La contraseña es incorrecta'));
    }
  }
    }
  // si no encontrpo el usuario 
  else {
    return done(null, false, req.flash('info', 'El usuario no está registrado'));
  }
}));









// ------------------------------------------------------------------- estrategia registro NUEVO
passport.use('register', new localStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {

  let newUser = req.body
  newUser.password = await bcrypt.hashSync( newUser.password, bcrypt.genSaltSync(10));
  // Saving in the Database
  const result = await pool.query('INSERT INTO usuarios SET ? ', newUser);
  newUser.id = result.insertId;
  return done(null, newUser);
}));



passport.isAuthenticated = (req, res, next) => {
  if( req.isAuthenticated()){
    return next();
  }
  req.flash('info','Debes iniciar sesion antes');
  res.redirect('/');
} 



module.exports = passport;