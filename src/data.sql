-- Database source: https://api.clever-cloud.com/v2/session/login 


-- CREACION TABLA USUARIOS
CREATE TABLE `blohtopopjwq2buo0ymr`.`usuarios` ( 
  `id` INT NOT NULL AUTO_INCREMENT , 
  `nombre` VARCHAR(30) NOT NULL , 
  `apellido` VARCHAR(30) NOT NULL , 
  `email` VARCHAR(30) NOT NULL , 
  `dni` VARCHAR(10) NOT NULL , 
  `estado` VARCHAR(15) NOT NULL , 
  `perfil` VARCHAR(20) NOT NULL , 
  `username` VARCHAR(20) NOT NULL , 
  `password` VARCHAR(60) NOT NULL ,
   `empresa` VARCHAR(20) NOT NULL ,
   `alta` DATE NOT NULL , 
   PRIMARY KEY (`id`)) 
   ENGINE = InnoDB;


-- CREACION TABLA DESTINOS
CREATE TABLE `blohtopopjwq2buo0ymr`.`destinos` ( 
  `id` INT NOT NULL AUTO_INCREMENT , 
  `provincia` VARCHAR(20) NOT NULL , 
  `localidad` VARCHAR(30) NOT NULL , 
  `transportePC1` VARCHAR(20) NOT NULL , 
  `transporteDetallePC1` VARCHAR(40) NOT NULL , 
  `transportePC3` VARCHAR(20) NOT NULL , 
  `transporteDetallePC3` VARCHAR(40) NOT NULL , 
  `tiempoDeTransitoPC3` VARCHAR(10) NOT NULL , 
  `transporteRetorno` VARCHAR(20) NOT NULL ,
   `guiasDeRetornoDetalle` VARCHAR(200) NOT NULL ,
   `tiempoDeTransitoPC1` VARCHAR(10) NOT NULL , 
   `cutoff` VARCHAR(5) NOT NULL , 
   `horarioDisponible` VARCHAR(5) NOT NULL , 
   `direccionDeRetiro` VARCHAR(30) NOT NULL , 
   `comentarios` VARCHAR(200) NOT NULL , 
   `estado` VARCHAR(10) NOT NULL , 
   `activoDesde` DATE NOT NULL , 
   PRIMARY KEY (`id`)) 
   ENGINE = InnoDB;



  --  INSERT
  INSERT INTO `usuarios` (`id`, `nombre`, `apellido`, `email`, `dni`, `estado`, `perfil`, `username`, `password`, `empresa`, `alta`) VALUES (NULL, '', '', '', '', '', '', '', '', '', '')