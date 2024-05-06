
import * as THREE from 'three'
import { CSG } from '../libs/CSG-v2.js'
 
class Personaje extends THREE.Object3D {
  constructor(geomTubo) {
    super();
    this.t = 0;
    this.reloj = new THREE.Clock();

    this.velocidad = 10;

    this.tubo = geomTubo;
    this.path = geomTubo.parameters.path;
    this.radio = geomTubo.parameters.radius;
    this.segmentos = geomTubo.parameters.tubularSegments;

    this.posicionSuperficie = new THREE.Object3D();
    this.movimientoLateral = new THREE.Object3D();
    this.nodoPosOrientTubo = new THREE.Object3D();

    this.nodoPosOrientTubo.add(this.movimientoLateral);
    this.movimientoLateral.add(this.posicionSuperficie);
    
    // El material se usa desde varios métodos. Por eso se alamacena en un atributo
    this.material = new THREE.MeshStandardMaterial({color: 0x000000,side: THREE.DoubleSide});
    this.material2 = new THREE.MeshStandardMaterial({color: 0x9b9b9b,side: THREE.DoubleSide});
    this.material3 = new THREE.MeshStandardMaterial({color: 0xff0080,side: THREE.DoubleSide});
    
    // A la base no se accede desde ningún método. Se almacena en una variable local del constructor
    var tamano = 0.5;   // 15 cm de largo. Las unidades son metros
    var base = this.createBase(tamano);
    
    this.posicionSuperficie.add(base);
    
    this.add (this.posicionSuperficie);
  }
  
  createBase(tama) {
    var esferaChica = new THREE.SphereGeometry(0.15,8,8)
    var esferaGrande = new THREE.SphereGeometry(0.4,8,8)
    
    var esfera = new THREE.Mesh (new THREE.SphereGeometry(0.5,8,8), this.material2);
    var ojo1 = new THREE.Mesh (new THREE.SphereGeometry(0.125,8,8), this.material2);
    var ojo2 = new THREE.Mesh (new THREE.SphereGeometry(0.125,8,8), this.material2);

    var ojo3 = new THREE.Mesh (new THREE.SphereGeometry(0.075,8,8), this.material);
    var ojo4 = new THREE.Mesh (new THREE.SphereGeometry(0.075,8,8), this.material);

    //Movimientos de los ojos
    ojo1.translateX(0.35);
    ojo1.translateY(0.2);
    ojo1.translateZ(0.15);

    ojo3.translateX(0.35);
    ojo3.translateY(0.2);
    ojo3.translateZ(0.15);

    ojo2.translateX(0.35);
    ojo2.translateY(0.2);
    ojo2.translateZ(-0.1);

    ojo4.translateX(0.35);
    ojo4.translateY(0.2);
    ojo4.translateZ(-0.1);


    // Crear un shape para la boca sonriente
    var bocaShape = new THREE.Shape();
    bocaShape.moveTo(0.25, 0.05);
    bocaShape.quadraticCurveTo(0, 0.35, -0.25, 0.05);

    var bocaGeometry = new THREE.ExtrudeGeometry(bocaShape, {
        depth: 0.15,
        bevelEnabled: false
    });

    var boca = new THREE.Mesh(bocaGeometry, this.material); // Crear la geometría de la boca
    boca.position.set(0.40, 0.05, 0); // Posición de la boca
    boca.rotation.x = Math.PI ; // Rotar la boca para que esté orientada correctamente
    boca.rotation.y = Math.PI / 2 ;


    var lenguaGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.2, 16); // Geometría de un cilindro para representar la lengua
    var lengua = new THREE.Mesh(lenguaGeometry, this.material3); // Crear la malla de la lengua
    lengua.position.set(0.47, -0.1, 0); // Posición de la lengua, ajusta según sea necesario
    //lengua.rotation.x = Math.PI ; // Rotar la boca para que esté orientada correctamente
    lengua.rotation.z = Math.PI  / 2;
    
    var csg = new CSG();
    var ojos = new CSG();
    //var boca = new CSG();
    ojos.union([ojo1,ojo2,boca]);
    var resul1 = ojos.toMesh();
    csg.subtract([esfera,resul1]);
    

    var resulF = csg.toMesh();
    
    var base = new THREE.Object3D();
    base.add( resulF );
    base.add( ojo3 );
    base.add( ojo4 );
    base.add(lengua); // Agregar la lengua a la boca
    

    return base;
  }
  
  
  
  
  
  update () {

    var segundosTranscurridos = this.reloj.getDelta(); 
    this.t += this.velocidad * segundosTranscurridos ;

    if (this.t < 0) {
      this.t = 0;  // Ajustar this.t al límite inferior de la curva
      console.log("hola");
    } else if (this.t > 1) {
        this.t = 1;  // Ajustar this.t al límite superior de la curva
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

export { Personaje }
