 
// Clases de la biblioteca
// import * as THREE from "three"

import * as THREE from '../libs/three.module.js'
import { GUI } from '../libs/dat.gui.module.js'
import { TrackballControls } from '../libs/TrackballControls.js'

// Clases de mi proyecto

import { Personaje } from '../personaje/Personaje.js'
import { Circuito } from '../circuito/Circuito.js'
import { Muro } from '../muro/Muro.js'
import { Seta } from '../seta/Seta.js'
import { Boo } from '../boo/Boo.js'
import { Muelle } from '../muelle/Muelle.js'
import { Coin} from '../coin/Coin.js'
import { Alas} from '../alas/Alas.js'
import { Articulado} from '../articulado/Articulado.js'
 
/// La clase fachada del modelo
/**
 * Usaremos una clase derivada de la clase Scene de Three.js para llevar el control de la escena y de todo lo que ocurre en ella.
 */

class MyScene extends THREE.Scene {
  // Recibe el  div  que se ha creado en el  html  que va a ser el lienzo en el que mostrar
  // la visualización de la escena
  constructor (myCanvas) { 
    super();
    this.cambioCamara = true;
    this.pick=false;
    this.score = 0; // Variable para el puntaje
    // Lo primero, crear el visualizador, pasándole el lienzo sobre el que realizar los renderizados.
    this.renderer = this.createRenderer(myCanvas);
    
    // Se crea la interfaz gráfica de usuario
    this.gui = this.createGUI ();
    
    // Construimos los distinos elementos que tendremos en la escena
    
    // Todo elemento que se desee sea tenido en cuenta en el renderizado de la escena debe pertenecer a esta. Bien como hijo de la escena (this en esta clase) o como hijo de un elemento que ya esté en la escena.
    // Tras crear cada elemento se añadirá a la escena con   this.add(variable)
    this.createLights ();
    
    // Tendremos una cámara con un control de movimiento con el ratón
    this.createCamera ();
    
    // Un suelo 
    this.createGround ();
    
    // Y unos ejes. Imprescindibles para orientarnos sobre dónde están las cosas
    // Todas las unidades están en metros
    this.axis = new THREE.AxesHelper (0.1);
    this.add (this.axis);
    
    
    // Por último creamos el modelo.
    // El modelo puede incluir su parte de la interfaz gráfica de usuario. Le pasamos la referencia a 
    // la gui y el texto bajo el que se agruparán los controles de la interfaz que añada el modelo.
    var cir = new Circuito();
    this.model = cir;
    this.boo = new Boo(cir.get_geometria());
    this.alas = new Alas();
    this.articulado = new Articulado();
    this.articulado.position.set(0, 7.5, -1);
    this.coin = new Coin(cir.get_geometria());
    this.muelle = new Muelle(cir.get_geometria());
    this.muro = new Muro(cir.get_geometria());
    this.seta = new Seta(cir.get_geometria());
    this.personaje = new Personaje(cir.get_geometria());
    this.cameraPersonaje = this.personaje.get_camera();
    this.add(this.alas);
    this.add(this.articulado);
    this.add(this.coin);
    this.add(this.muelle);
    this.add(this.boo);
    this.add(this.seta);
    this.add(this.muro);
    this.add(this.personaje);
    this.add (this.model);
    
    

  }
  
  createCamera () {
    // Para crear una cámara le indicamos
    //   El ángulo del campo de visión vértical en grados sexagesimales
    //   La razón de aspecto ancho/alto
    //   Los planos de recorte cercano y lejano
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 100);
    // También se indica dónde se coloca
    this.camera.position.set (10, -3,5);
    // Y hacia dónde mira
    var look = new THREE.Vector3 (0,0,0);
    this.camera.lookAt(look);
    this.add (this.camera);
    
    // Para el control de cámara usamos una clase que ya tiene implementado los movimientos de órbita
    this.cameraControl = new TrackballControls (this.camera, this.renderer.domElement);
    
    // Se configuran las velocidades de los movimientos
    this.cameraControl.rotateSpeed = 5;
    this.cameraControl.zoomSpeed = -2;
    this.cameraControl.panSpeed = 0.5;
    // Debe orbitar con respecto al punto de mira de la cámara
    this.cameraControl.target = look;
  }
  
  createGround () {
    // El suelo es un Mesh, necesita una geometría y un material.
    
    // La geometría es una caja con muy poca altura
    var geometryGround = new THREE.BoxGeometry (0.5,0.02,0.5);
    
    // El material se hará con una textura de madera
    var texture = new THREE.TextureLoader().load('../imgs/wood.jpg');
    var materialGround = new THREE.MeshStandardMaterial ({map: texture});
    
    // Ya se puede construir el Mesh
    var ground = new THREE.Mesh (geometryGround, materialGround);
    
    // Todas las figuras se crean centradas en el origen.
    // El suelo lo bajamos la mitad de su altura para que el origen del mundo se quede en su lado superior
    ground.position.y = -0.01;
    
    // Que no se nos olvide añadirlo a la escena, que en este caso es  this
    //this.add (ground);
  }

  createGUI() {
    var gui = new GUI();
  
    this.guiControls = {
      lightPower: 100.0, // La potencia de esta fuente de luz se mide en lúmenes
      ambientIntensity: 0.35,
      sunIntensity: 3, // Control para la intensidad de la luz del sol
      axisOnOff: true
    };
  
    var folder = gui.addFolder('Luz y Ejes');
  
    folder.add(this.guiControls, 'lightPower', 0, 200, 10)
      .name('Luz puntual: ')
      .onChange(value => this.setLightPower(value));
  
    folder.add(this.guiControls, 'ambientIntensity', 0, 1, 0.05)
      .name('Luz ambiental: ')
      .onChange(value => this.setAmbientIntensity(value));
  
    folder.add(this.guiControls, 'sunIntensity', 0, 3, 0.1)
      .name('Intensidad del sol: ')
      .onChange(value => this.setSunIntensity(value));
  
    folder.add(this.guiControls, 'axisOnOff')
      .name('Mostrar ejes: ')
      .onChange(value => this.setAxisVisible(value));
  
    return gui;
  }
  
  setSunIntensity(value) {
    this.sunLight.intensity = value;
  }
  
  
  createLights () {
    // Se crea una luz ambiental, evita que se vean complentamente negras las zonas donde no incide de manera directa una fuente de luz
    // La luz ambiental solo tiene un color y una intensidad
    // Se declara como   var   y va a ser una variable local a este método
    //    se hace así puesto que no va a ser accedida desde otros métodos
    this.ambientLight = new THREE.AmbientLight('white', this.guiControls.ambientIntensity);
    this.ambientLight2 = new THREE.AmbientLight('black', this.guiControls.ambientIntensity);
    // La añadimos a la escena
    //this.add (this.ambientLight2);

    this.ambientLight3 = new THREE.AmbientLight(0x552200, 0.5); // Luz ambiental con tono rojizo
    this.add(this.ambientLight3);

    // Crear una luz direccional simulando la luz del sol del desierto
    this.sunLight = new THREE.DirectionalLight(0xFF4500, 3); // Luz direccional con tono anaranjado rojizo
    this.sunLight.position.set(5, 10, 5); // Posiciona la luz en la escena
    this.sunLight.castShadow = true; // Habilita sombras si es necesario
    this.add(this.sunLight);
    
    // Se crea una luz focal que va a ser la luz principal de la escena
    // La luz focal, además tiene una posición, y un punto de mira
    // Si no se le da punto de mira, apuntará al (0,0,0) en coordenadas del mundo
    // En este caso se declara como   this.atributo   para que sea un atributo accesible desde otros métodos.
    this.pointLight = new THREE.SpotLight( 0xffffff );
    this.pointLight.power = this.guiControls.lightPower;
    this.pointLight.position.set( 2, 3, 1 );
    this.pointLight2 = new THREE.SpotLight( 0xFF0000 );
    this.pointLight2.power = this.guiControls.lightPower;
    this.pointLight2.position.set( 2, 3, 1 );
    this.pointLight3 = new THREE.SpotLight( 0x00FF00 );
    this.pointLight3.power = this.guiControls.lightPower;
    this.pointLight3.position.set( -2, -2, -2 );
    this.pointLight4 = new THREE.SpotLight( 0x0000FF );
    this.pointLight4.power = this.guiControls.lightPower;
    this.pointLight4.position.set( 0, 8.5, 1 );
    this.add (this.pointLight);
    this.add (this.pointLight2);
    this.add (this.pointLight3);
    this.add (this.pointLight4);
  }
  
  setLightPower (valor) {
    this.pointLight.power = valor;
  }

  setAmbientIntensity (valor) {
    this.ambientLight.intensity = valor;
  }  
  
  setAxisVisible (valor) {
    this.axis.visible = valor;
  }
  
  createRenderer (myCanvas) {
    // Se recibe el lienzo sobre el que se van a hacer los renderizados. Un div definido en el html.
    
    // Se instancia un Renderer   WebGL
    var renderer = new THREE.WebGLRenderer();
    
    // Se establece un color de fondo en las imágenes que genera el render
    renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);
    
    // Se establece el tamaño, se aprovecha la totalidad de la ventana del navegador
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // La visualización se muestra en el lienzo recibido
    $(myCanvas).append(renderer.domElement);
    
    return renderer;  
  }
  
  getCamera () {
    if(this.cambioCamara == true){
      return this.camera;
    }else{
      return this.cameraPersonaje;
    }
  }
  //llamar cuando pulsas espacio
  setCameraAspect (ratio) {
    // Cada vez que el usuario modifica el tamaño de la ventana desde el gestor de ventanas de
    // su sistema operativo hay que actualizar el ratio de aspecto de la cámara
    this.camera.aspect = ratio;
    // Y si se cambia ese dato hay que actualizar la matriz de proyección de la cámara
    this.camera.updateProjectionMatrix();
  }
    //LLamar
  onWindowResize () {
    // Este método es llamado cada vez que el usuario modifica el tamapo de la ventana de la aplicación
    // Hay que actualizar el ratio de aspecto de la cámara
    this.setCameraAspect (window.innerWidth / window.innerHeight);
    
    // Y también el tamaño del renderizador
    this.renderer.setSize (window.innerWidth, window.innerHeight);
  }

  update () {
    // Le decimos al renderizador "visualiza la escena que te indico usando la cámara que te estoy pasando"
    this.renderer.render (this, this.getCamera());

    // Se actualiza la posición de la cámara según su controlador
    this.cameraControl.update();
    
    // Se actualiza el resto del modelo
    this.model.update();

    this.personaje.update();
    this.muro.update();
    this.seta.update();
    this.boo.update();
    this.muelle.update();
    this.coin.update();
    this.alas.update();
    this.articulado.update();

    $(window).on("keydown", (event) => {
      if (event.key === " " && !this.spaceBarPressed) {
          // Marcar la tecla como presionada
          this.spaceBarPressed = true;
          if(this.cambioCamara == true){
            this.cambioCamara = false;
          }else{
            this.cambioCamara = true;
          }
      }
    });

    // Manejar evento de liberación de tecla
    $(window).on("keyup", (event) => {
        if (event.key === " ") {
            // Marcar la tecla como no presionada
            this.spaceBarPressed = false;
        }
    });

    // Listener para la tecla "a"
    $(window).on("keydown", (event) => {
      if (event.key === "a") {
        this.personaje.rotateCar('left');
      }
    });

    // Listener para la tecla "d"
    $(window).on("keydown", (event) => {
      if (event.key === "d") {
        this.personaje.rotateCar('right');
      }
    });

    $(window).one("click", (event) => {
      onDocumentMouseDown(event, this.personaje, [this.alas], this.getCamera(), new THREE.Raycaster(), this);
    });
    
    detectarColisiones(this.personaje,[this.seta,this.muelle,this.coin],[this.muro,this.boo,this.articulado],this);
    // Este método debe ser llamado cada vez que queramos visualizar la escena de nuevo.
    // Literalmente le decimos al navegador: "La próxima vez que haya que refrescar la pantalla, llama al método que te indico".
    // Si no existiera esta línea,  update()  se ejecutaría solo la primera vez.
    requestAnimationFrame(() => this.update())
  }
}

var objetosChocadosDuranteAtravieso = [];
// Función para detectar colisiones del personaje con otros objetos en la escena
function detectarColisiones(personaje, sceneObjects,sceneObjects2,scene) {
    
    // Crear una caja envolvente para el personaje
    var playerBoundingBox = new THREE.Box3();
    playerBoundingBox.setFromObject(personaje);

    // Verificar colisiones con otros elementos de la escena
    for (let object of sceneObjects) {
        // Verificar si el objeto está en la lista de objetos chocados durante el atravesado
        if (!objetosChocadosDuranteAtravieso.includes(object)) {
            var objectBoundingBox = new THREE.Box3();
            objectBoundingBox.setFromObject(object);

            // Verificar si las cajas envolventes se intersectan
            if (playerBoundingBox.intersectsBox(objectBoundingBox)) {
                // Colisión detectada, realizar acciones necesarias
                // Por ejemplo, detener el movimiento del personaje
                console.log("hit");
                scene.personaje.colision_positiva();
                // Registrar el objeto como un objeto chocado durante el atravesado
                objetosChocadosDuranteAtravieso.push(object);
                // Puedes realizar otras acciones aquí, como cambiar la posición del personaje, aplicar efectos visuales, etc.
            }
        }
    }

    for (let object of sceneObjects2) {
      // Verificar si el objeto está en la lista de objetos chocados durante el atravesado
      if (!objetosChocadosDuranteAtravieso.includes(object)) {
          var objectBoundingBox = new THREE.Box3();
          objectBoundingBox.setFromObject(object);

          // Verificar si las cajas envolventes se intersectan
          if (playerBoundingBox.intersectsBox(objectBoundingBox)) {
              // Colisión detectada, realizar acciones necesarias
              // Por ejemplo, detener el movimiento del personaje
              console.log("hit2");
              scene.personaje.colision_negativa();
              // Registrar el objeto como un objeto chocado durante el atravesado
              objetosChocadosDuranteAtravieso.push(object);
              // Puedes realizar otras acciones aquí, como cambiar la posición del personaje, aplicar efectos visuales, etc.
          }
      }
  }

    // Verificar si el personaje ha salido de algún objeto y actualizar la lista de objetos chocados durante el atravesado
    for (let i = 0; i < objetosChocadosDuranteAtravieso.length; i++) {
        let objectBoundingBox = new THREE.Box3();
        objectBoundingBox.setFromObject(objetosChocadosDuranteAtravieso[i]);

        if (!playerBoundingBox.intersectsBox(objectBoundingBox)) {
            // El personaje ha salido del objeto, eliminarlo de la lista
            objetosChocadosDuranteAtravieso.splice(i, 1);
            // Disparar eventos o realizar acciones adicionales si es necesario
        }
    }
}


function onDocumentMouseDown(event, personaje, pickableObjects, camera, raycaster, scene) {
  // Declara la variable mouse y calcula las coordenadas normalizadas del mouse
  var mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Actualiza el raycaster con la posición del mouse y la cámara
  raycaster.setFromCamera(mouse, camera);

  // Encuentra las intersecciones con los objetos clicables
  var pickedObjects = raycaster.intersectObjects(pickableObjects, true);

  // Verifica si se han encontrado intersecciones
  if (pickedObjects.length > 0) {
      // Accede al primer objeto intersecado (el más cercano a la cámara)
      var selectedObject = pickedObjects[0].object;
      // Accede al punto de intersección en coordenadas del mundo
      var selectedPoint = pickedObjects[0].point;
      
      // Cambia el color del objeto a rojo
      selectedObject.material.color.set(0xff0000);
      scene.setSunIntensity(0);
      scene.score += 1; // Aumenta el score
      document.getElementById('score').innerText = `Score: ${scene.score}`; // Actualiza el texto del score
      
      // Establece un temporizador para restaurar el color original después de 1 segundo
      setTimeout(function() {
        selectedObject.material.color.set(0xffffff); // Restaurar el color original
        scene.setSunIntensity(3);
      }, 1000);
  }
}








/// La función   main
$(function () {
  // Se instancia la escena pasándole el div que se ha creado en el html para visualizar
  var scene = new MyScene("#WebGL-output");

  // Se añade el event listener para el evento de cambio de tamaño de la ventana
  window.addEventListener("resize", () => scene.onWindowResize());

  // Que no se nos olvide, la primera visualización.
  scene.update();
});

