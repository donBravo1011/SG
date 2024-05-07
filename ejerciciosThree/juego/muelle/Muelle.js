
import * as THREE from 'three'
 
class Muelle extends THREE.Object3D {
  constructor(geomTubo) {
    super();

    this.t = 0.6;
    this.reloj = new THREE.Clock();

    this.velocidad = 0.015;

    this.tubo = geomTubo;
    this.path = geomTubo.parameters.path;
    this.radio = geomTubo.parameters.radius;
    this.segmentos = geomTubo.parameters.tubularSegments;

    this.posicionSuperficie = new THREE.Object3D();
    this.posicionSuperficie.position.y = this.radio+0.02;
    this.movimientoLateral = new THREE.Object3D();
    this.nodoPosOrientTubo = new THREE.Object3D();

    this.nodoPosOrientTubo.add(this.movimientoLateral);
    this.movimientoLateral.add(this.posicionSuperficie);
    
    
    // El material se usa desde varios métodos. Por eso se alamacena en un atributo
    this.material = new THREE.MeshStandardMaterial({color: 0xffff00});
    this.material2 = new THREE.MeshStandardMaterial({color: 0xff8000,side: THREE.DoubleSide});
    
    
    // A la base no se accede desde ningún método. Se almacena en una variable local del constructor
    var tamano = 0.5;   // 15 cm de largo. Las unidades son metros
    var base = this.createBase(tamano);
    
    
    this.posicionSuperficie.add(base);
    
    this.add (this.nodoPosOrientTubo);
  }
   
  createBase(tama) {
      var base = new THREE.Object3D();
      var points = []; // Puntos de control para la trayectoria del muelle
  
      // Genera los puntos de control a lo largo de una curva para el muelle
      for (var i = 0; i < 10; i++) {
        var x = 0; // Posición en el eje X
        var y = i * 0.2; // Posición en el eje Y (ascendente)
        var z = Math.sin(y * 10) * 0.4; // Posición en el eje Z (giratoria)

        points.push(new THREE.Vector3(x, y, z));
      }
  
      // Vamos a usar BARRIDO
      var curve = new THREE.CatmullRomCurve3(points);

      var shape = new THREE.Shape();
      shape.moveTo(0, 0); // Mueve el punto inicial a la posición (0, 0)
      shape.absarc(0, 0, 0.1, 0, Math.PI * 2, false); // Crea un arco completo con radio 0.1

      var options = { steps: 500, curveSegments: 4, extrudePath: curve };
      var geometry = new THREE.ExtrudeGeometry(shape, options);

      
      var material = new THREE.MeshPhongMaterial({ color: 0x808080,side: THREE.DoubleSide }); // Puedes ajustar el color según tu preferencia
  
      // Crea la malla del muelle usando la geometría y el material
      var muelle = new THREE.Mesh(geometry, material);
  
      muelle.scale.set(0.25,0.25,0.25);

      base.add(muelle);
  
      return base;
  }
  
  
  update () {
    var segundosTranscurridos = this.reloj.getDelta(); 
    this.t += this.velocidad * segundosTranscurridos ;

    if (this.t < 0) {
      this.t += 1;  // Ajustar this.t al límite inferior de la curva
      console.log("hola");
    } else if (this.t > 1) {
        this.t -= 1;  // Ajustar this.t al límite superior de la curva
        console.log("adios");
    }

    var posTmp = this.path.getPointAt(this.t) ;
    this.nodoPosOrientTubo.position.copy(posTmp);
    var tangente = this.path.getTangentAt(this.t);
    posTmp.add(tangente);
    var segmentoActual = Math.floor(this.t * this.segmentos);
    this.nodoPosOrientTubo.up = this.tubo.binormals[segmentoActual];
    this.nodoPosOrientTubo.lookAt(posTmp);
  }
}

export { Muelle }
