
import * as THREE from 'three'
import { CSG } from '../libs/CSG-v2.js'


 
class Muro extends THREE.Object3D {
  constructor(geomTubo) {
    super();
    
    this.t = 0.2;
    this.reloj = new THREE.Clock();

    this.velocidad = 0.01;

    this.tubo = geomTubo;
    this.path = geomTubo.parameters.path;
    this.radio = geomTubo.parameters.radius;
    this.segmentos = geomTubo.parameters.tubularSegments;

    this.posicionSuperficie = new THREE.Object3D();
    this.posicionSuperficie.position.y = this.radio+0.15;
    this.movimientoLateral = new THREE.Object3D();
    this.nodoPosOrientTubo = new THREE.Object3D();

    this.nodoPosOrientTubo.add(this.movimientoLateral);
    this.movimientoLateral.add(this.posicionSuperficie);



    this.material = new THREE.MeshStandardMaterial({color: 0x8b8c7a,side: THREE.DoubleSide});
    this.material2 = new THREE.MeshStandardMaterial({color: 0x9b9b9b,side: THREE.DoubleSide});
    this.material3 = new THREE.MeshStandardMaterial({color: 0xff0080,side: THREE.DoubleSide});
    
    // A la base no se accede desde ningún método. Se almacena en una variable local del constructor
    var tamano = 0.5;   // 15 cm de largo. Las unidades son metros
    var base = this.createBase(tamano);
    
    
    this.posicionSuperficie.add(base);
    
    this.add (this.nodoPosOrientTubo);
  }
  
  createBase(tama) {
    // Crea el muro principal
    var muro = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 0.1), this.material);
    muro.rotation.y = Math.PI / 2;
    muro.position.set(0,-0.2,0);
    
    
    // Crea un agujero en el muro utilizando las formas creadas
    var hole = new THREE.Shape();
    hole.absellipse(0,0,0.1,0.1,0,Math.PI * 2);
    
    var holeGeometry = new THREE.ExtrudeGeometry(hole, {
      depth: 0.35,
      bevelEnabled: false
    });
    
    var geometry = new THREE.ShapeGeometry(hole);

    var hoyo = new THREE.Mesh(holeGeometry, this.material);
    hoyo.rotation.y = Math.PI / 2;
    hoyo.position.set(-0.15,0,0.2);

    var hoyo2 = new THREE.Mesh(holeGeometry, this.material);
    hoyo2.rotation.y = Math.PI / 2;
    hoyo2.position.set(-0.15,0,-0.2);



    // Crear un shape para la boca sonriente
    var bocaShape = new THREE.Shape();
    bocaShape.moveTo(0.25, 0.05);
    bocaShape.quadraticCurveTo(0, 0.35, -0.25, 0.05);

    var bocaGeometry = new THREE.ExtrudeGeometry(bocaShape, {
        depth: 0.35,
        bevelEnabled: false
    });

    var boca = new THREE.Mesh(bocaGeometry, this.material); // Crear la geometría de la boca
    boca.position.set(-0.20, -0.2, 0); // Posición de la boca
    boca.rotation.x = Math.PI ; // Rotar la boca para que esté orientada correctamente
    boca.rotation.y = Math.PI / 2 ;

    var csg = new CSG();
    csg.subtract([muro,hoyo]);
    csg.subtract([hoyo2]);
    csg.subtract([boca]);
    var resulF = csg.toMesh();
    // Crea un objeto 3D para contener el muro y cualquier otra cosa que desees agregar
    const base = new THREE.Object3D();

    resulF.scale.set(0.25,0.25,0.25);
    resulF.rotateY(90);

    base.add(resulF);
    

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

export { Muro }
