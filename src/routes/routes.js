const express = require("express");
const router = express.Router();
const passport = require("../passport");
const { isAuthenticated } = require("../passport");
const bcrypt = require("bcryptjs");
const pool = require('../database');
const { promisify } = require('util');





// ------------------------------------------------------------------- login
// login - get => formulario de login
router.get("/", (req, res) => {
  res.render("login", { message: req.flash("info") });
});

// login - post => procesar datos e iniciar sesion o register o login
router.post("/login", passport.authenticate('inicio.sesion',{
  successRedirect: '/home',
  failureRedirect: '/',
  failureFlash: true  //no se para que es esto
}));

// ------------------------------------------------------------------- register
// register - get => formulario de registro
router.get("/register", (req, res) => {
  res.render("register", { message: req.flash("info") });
});

// register - post => analizo credeciales y almaceno en DB o mando a login
router.post("/register", passport.authenticate('register',{
  successRedirect: '/',
  failureRedirect: '/register'
}));



// ------------------------------------------------------------------- cerrar sesion
router.get('/salir', (req, res) => {
  req.logOut();
  res.redirect('/'); 
})



// ------------------------------------------------------------------- home
// home - get => pagina de inicio (logueado)
router.get("/home", isAuthenticated , async (req, res, next) => {

  await pool.getConnection((err, connection) =>{
    if(err) console.log(err);
    else{
      connection.query = promisify(connection.query);
      connection.query("SELECT * FROM `destinos` WHERE `estado` = 'Activo' ", (error, resultados) => {
        if(error) console.log(error);
        else{
          const destinos = resultados;
          connection.release();
          res.render("home", { 
            message: req.flash("info"),
            user: req.user || null,
            destinos
          });
        }
      });
    }
  });
});





// ------------------------------------------------------------------- usuarios
// home - get => pagina de inicio (logueado)
router.get("/usuarios", isAuthenticated , async (req, res, next) => {

  await pool.getConnection((err, connection) =>{
    if(err) console.log(err);
    else{
      connection.query = promisify(connection.query);
      connection.query("SELECT * FROM usuarios", (error, resultados) => {
        if(error) console.log(error);
        else{
          connection.release();
          const usuarios = resultados;
          res.render("usuarios", { 
            message: req.flash("info"),
            user: req.user || null,
            usuarios
          });
        }
      });
    }
  });
});



// ------------------------------------------------------------------- editarUsuario
router.get("/editarUsuario/:id", isAuthenticated , async (req, res, next) => {

  await pool.getConnection((err, connection) =>{
    if(err) console.log(err);
    else{
      const id = req.params.id;
      connection.query = promisify(connection.query);
      connection.query("SELECT * FROM usuarios WHERE id = ?", [id], (error, resultados) => {
        if(error) console.log(error);
        else{
          connection.release();
          const usuario = resultados[0];
          res.render("editarUsuario", { 
            message: req.flash("info"),
            user: req.user || null,
            usuario
          });
        }
      });
    }
  });
});



router.post('/editarUsuario/:id', isAuthenticated , async (req, res, next) => {

  await pool.getConnection( async (err, connection) =>{
    if(err) console.log(err);
    else{
      const { id } = req.params;
      let newData = req.body;

      newData.password === '' ? 
        delete newData.password
        :
        newData.password = await bcrypt.hashSync( newData.password, bcrypt.genSaltSync(10));


        connection.query = promisify(connection.query);
      connection.query("UPDATE usuarios set ? WHERE id = ?", [newData, id], (error, resultados) => {
        if(error) console.log(error);
        else{
          connection.release();
          console.log('Se edita el usuario OK');
          req.flash("info",'Usuario actualizado corectamente')
          res.redirect("/usuarios");  // linea 72
        }
      });
    }
  });
})



// ------------------------------------------------------------------- destinos


// ------------------------------------------------------------------- agregar - get
router.get("/addOperatoria", isAuthenticated, (req, res) => {
  res.render("addOperatoria", {
    user: req.user || null
  } );
});

// ------------------------------------------------------------------- agregar - post
router.post("/addOperatoria", isAuthenticated, async (req, res) => {
  //console.log('req.body => ', req.body);

  await pool.getConnection((err, connection) =>{
    if(err) console.log(err);
    else{
      const newOpe = req.body;
      newOpe.activoDesde = new Date();
      newOpe.provincia = newOpe.provincia.toUpperCase();
      newOpe.localidad = newOpe.localidad.toUpperCase();
      connection.query = promisify(connection.query);
      connection.query("INSERT INTO destinos SET ?", [newOpe], (error, resultados) => {
        if(error) console.log(error);
        else{
          const msj = {
            fecha: new Date(),
            comentario: '@'+req.user.username + ' ha creado una nueva operatoria: ' + newOpe.localidad 
          }
          connection.query("INSERT INTO logs SET ?", [msj], (error, resultados) => {
            if(error) console.log(error);
            else{
              connection.release();
              console.log('Se ha agregado (1) nuevo destino');
              req.flash("info",'Se ha agregado (1) nuevo destino')
              res.redirect('/home');
            }
          })
        }
      });
    }
  });
});



// ------------------------------------------------------------------- habilitar - get
router.get("/habilitarDestino", isAuthenticated , async (req, res, next) => {

  await pool.getConnection((err, connection) =>{
    if(err) console.log(err);
    else{
      connection.query = promisify(connection.query);
      connection.query("SELECT * FROM `destinos` WHERE `estado` = 'Inactivo' ", (error, resultados) => {
        if(error) console.log(error);
        else{
          const destinos = resultados;
          connection.release();
          res.render("habilitarDestino", { 
            message: req.flash("info"),
            user: req.user || null,
            destinos
          });
        }
      });
    }
  });
});




// ------------------------------------------------------------------- editar -get
router.get("/editarOperatoria/:id", isAuthenticated, async (req, res) => {

  await pool.getConnection((err, connection) =>{
    if(err) console.log(err);
    else{
      const {id} = req.params;
      connection.query = promisify(connection.query);
      connection.query("SELECT * FROM destinos WHERE id = ?", [id], (error, resultados) => {
        if(error) console.log(error);
        else{
          connection.release();
          const destino = resultados[0];
          res.render('editarOperatoria', {
            user: req.user || null,
            destino
          });
        }
      });
    }
  });
});

// ------------------------------------------------------------------- editar destino -post
router.post("/editarOperatoria/:id", isAuthenticated, async (req, res) => {
  
  await pool.getConnection( async (err, connection) =>{
    if(err) console.log(err);
    else{
      const { id } = req.params;
      let newData = req.body;

      console.log('newData => ', newData);

      

      if (newData.localidad !== '' ) {
        console.log('pasar localidad a mayus');
        newData.localidad = newData.localidad.toUpperCase();
        console.log('newData.localidad en mayus => ', newData.localidad);
      }



      newData.provincia = newData.provincia.toUpperCase();
      newData.localidad !== '' ? newData.localidad = newData.localidad.toUpperCase() : delete newData.localidad;
      if(newData.transporte == '') delete newData.transporte;
      if(newData.transporteDetalle == '') delete newData.transporteDetalle;
      if(newData.direccionDeRetiro == '') delete newData.direccionDeRetiro;
      if(newData.comentarios == '') delete newData.comentarios;
      
      //console.log('newData => ', newData);

      connection.query = promisify(connection.query);
      connection.query("UPDATE destinos set ? WHERE id = ?", [newData, id], (error, resultados) => {
        if(error) console.log(error);

        else{
          const msj = {
            fecha: new Date(),
            comentario: '@'+req.user.username + ' ha actualizado la operatoria: ' + newData.localidad 
          }
          connection.query("INSERT INTO logs SET ?", [msj], (error, resultados) => {
            if(error) console.log(error);
            else{
              connection.release();
              req.flash("info",'Destino actualizado correctamente.')
              res.redirect('/home');
            }
          })
        }
      });
    }
  });
  
});

// ------------------------------------------------------------------------------- guias de retorno


router.get("/guiasDeRetorno", isAuthenticated , async (req, res, next) => {

  await pool.getConnection((err, connection) =>{
    if(err) console.log(err);
    else{
      connection.query = promisify(connection.query);
      connection.query("SELECT * FROM `destinos` WHERE `guiasDeRetornoDetalle` != '' ", (error, resultados) => {
        if(error) console.log(error);
        else{
          const destinos = resultados;
          connection.release();
          res.render("guiasDeRetorno", { 
            message: req.flash("info"),
            user: req.user || null,
            destinos
          });
        }
      });
    }
  });
});


// ------------------------------------------------------------------------------- EXPORTAR DATA


router.get("/exportarData", isAuthenticated , async (req, res, next) => {

  await pool.getConnection((err, connection) =>{
    if(err) console.log(err);
    else{
      connection.query = promisify(connection.query);
      connection.query("SELECT * FROM `destinos` ", (error, resultados) => {
        if(error) console.log(error);
        else{
          const destinos = resultados;
          connection.release();
          res.render("exportarData", { 
            message: req.flash("info"),
            user: req.user || null,
            destinos
          });
        }
      });
    }
  });
});


// ------------------------------------------------------------------------------- LOGS


router.get("/logs", isAuthenticated , async (req, res, next) => {

  await pool.getConnection((err, connection) =>{
    if(err) console.log(err);
    else{
      connection.query = promisify(connection.query);
      connection.query("SELECT * FROM `logs` ", (error, resultados) => {
        if(error) console.log(error);
        else{
          const logs = resultados;
          connection.release();
          res.render("logs", { 
            message: req.flash("info"),
            user: req.user || null,
            logs
          });
        }
      });
    }
  });
});



module.exports = router;
