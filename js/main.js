if ( ! Detector.webgl ) Detector.addGetWebGLMessage();


var container, stats;

var views, glScene, glRenderer, camera, cssrenderer;
var cssScene, cssRenderer;

var mesh, group1, group2, group3, light;

var mouseX = 0, mouseY = 0;

var windowWidth, windowHeight;

var data = {
  labels: {
    x: ["1-month","3-month","6-month","1-year","2-year","3-year","5-year","7-year","10-year", "20-year","30-year"],
    z: ["\'95","\'96","\'97","\'98","\'99","\'00","\'01","\'02","\'03","\'04","\'05","\'06","\'07","\'08","\'09","\'10","\'11","\'12","\'13","\'14","\'15"],
    y: ["2%", "4%", "6%", "8%"]
  },
  us:[48,83,163,184,302,303,549,550,663,729,730, 849,858,890,973,1001,1063,1087,1130,1213,1254,1436,1586,1629,1630,1672,1768,1821,1852,1905,1951,1985,1986,2082,2145,2215,2216,2247,2290,2293,2372,2373,2404,2457,2590,2595,2598,2684,2716,2717,2785,2856,2878,2881,2992,2998,3062,3093,3203,3204,3229,3257,3258,3306,3419,3420,3467,3480,3503,3593,3613,3694,3731,3809,3839,3902,3903,3964,4092,4124,4205,4270,4323,4364,4449,4450,4451,4499,4536,4616,4617,4790,4791,4861,4863,4904,4905,4958,5003,5004,5067,5068,5178,5243,5251,5280,5323,5380,5400,5461,5462,5557,5558,5663,5683,5684,5711,5801,5882,5925,5952,6004,6067,6068,6119,6149,6184,6218,6248,6298,6299]
};


function labelAxis(labelAxis){

  var axis = {
    x : 0,
    y : 0,
    z : 0
  },
  separator = (Math.ceil((500/data.labels[labelAxis].length))*2)+10;

  axis[labelAxis] = separator;

  

  console.log(data.us.length);

  for ( var i = 0; i < data.labels[labelAxis].length; i ++ ) {

    var element = document.createElement( 'div' );
        element.textContent = data.labels[labelAxis][i];
        element.className = 'label';
        //element.style.background = new THREE.Color( Math.random() * 0xffffff ).getStyle();

    var object = new THREE.CSS3DObject( element );
        object.position.x = axis.x
        object.position.y = axis.y;
        object.position.z = axis.z;
        if (labelAxis !== "y"){
          object.rotation.x = -90*Math.PI/180;
        } 
        if (labelAxis == "z"){
          object.position.x = -50;
        }

        if (labelAxis == "y"){
          object.position.x = -50;
        }

        if (labelAxis == "x"){
          object.rotation.z = -270*Math.PI/180;
          object.position.z = -50;
        }
        cssScene.add( object );
        console.log(axis[labelAxis]);
        axis[labelAxis]+=separator;

  }

}



function gridInit(){
  /* GRIDS*/


  //GREEN
  var gridXZ = new THREE.GridHelper(500, (Math.ceil(500/data.labels.x.length))*2);
  gridXZ.setColors( new THREE.Color(0x19C37F), new THREE.Color(0x19C37F) );
  gridXZ.position.set( 500,0,500 );
  glScene.add(gridXZ);


  //BLUE
  var gridXY = new THREE.GridHelper(500, (Math.ceil(500/data.labels.y.length))*2);
  gridXY.position.set( 500,500,0 );
  gridXY.rotation.x = Math.PI/2;
  gridXY.setColors( new THREE.Color(0x1FC7FF), new THREE.Color(0x1FC7FF) );
  glScene.add(gridXY);

  //PINK
  var gridYZ = new THREE.GridHelper(500, (Math.ceil(500/data.labels.z.length))*2);
  gridYZ.position.set( 0,500,500 );
  gridYZ.rotation.z = Math.PI/2;
  gridYZ.setColors( new THREE.Color(0xDD006C), new THREE.Color(0xDD006C) );
  glScene.add(gridYZ);
  
}



function init() {

  container = document.getElementById( 'container' );

  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 30000 );
  camera.position.set( 200, 200, 200 );

  controls = new THREE.TrackballControls( camera );


//----------------------------------------------------------------------------
//   Create scenes for webGL and css
//____________________________________________________________________________

  glScene = new THREE.Scene();
  cssScene = new THREE.Scene();


//----------------------------------------------------------------------------
//    Add a light source & create Canvas
//____________________________________________________________________________

  light = new THREE.DirectionalLight( 0xffffff );
  light.position.set( 0, 0, 1 );
  glScene.add( light );

  // create canvas
  var canvas = document.createElement( 'canvas' );
      canvas.width = 128;
      canvas.height = 128;

  var context = canvas.getContext( '2d' );


//----------------------------------------------------------------------------
//    Test a label
//____________________________________________________________________________



labelAxis("x");
labelAxis("y");
labelAxis("z");


gridInit();

//----------------------------------------------------------------------------
//    SET UP RENDERERS
//____________________________________________________________________________
var geometry = new THREE.BoxGeometry(1000, 1000, 10);
console.log(geometry.vertices.length,data.us.length );
for (var i = 0, l = geometry.vertices.length; i < l; i++) {
  //geometry.vertices[i].z = data.us[i] * 5;
  //(rawValue - min) / (max - min)
  geometry.vertices[i].y = data.us[i];
  //geometry.vertices[i].x = data.us[i] * 5;
  console.log();
}
var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );

var plane = new THREE.Mesh(geometry, material);
plane.rotation.x= -Math.PI/2;
plane.position.set( 500,0,500 );

glScene.add(plane);

//----------------------------------------------------------------------------
//    SET UP RENDERERS
//____________________________________________________________________________

  //set up webGL renderer
  glRenderer = new THREE.WebGLRenderer();
  glRenderer.setPixelRatio( window.devicePixelRatio );
  glRenderer.setClearColor( 0xf0f0f0 );
  glRenderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( glRenderer.domElement );

  //set up CSS renderer
  cssRenderer = new THREE.CSS3DRenderer();
  cssRenderer.setSize( window.innerWidth, window.innerHeight );
  cssRenderer.domElement.style.position = 'absolute';
  cssRenderer.domElement.style.top = 0;
  container.appendChild( cssRenderer.domElement );



//----------------------------------------------------------------------------
//    SET UP STATS
//____________________________________________________________________________

  // stats = new Stats();
  // stats.domElement.style.position = 'absolute';
  // stats.domElement.style.top = '0px';
  // container.appendChild( stats.domElement );

}



function animate() {

  requestAnimationFrame( animate );

  controls.update();

  cssRenderer.render( cssScene, camera );
  glRenderer.render( glScene, camera );
}



// SET THIS SHIT UP
init();
animate();
