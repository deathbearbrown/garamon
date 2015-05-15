if ( ! Detector.webgl ) Detector.addGetWebGLMessage();


var container, stats;

var views, glScene, glRenderer, camera, cssrenderer;
var cssScene, cssRenderer;

var mesh, group1, group2, group3, light;

var mouseX = 0, mouseY = 0;

var windowWidth, windowHeight;

var data = {
  labels: {
    x: ["a","b","c","d","e","f","g","h","i", "j","k"],
    y: ["aa","bb","cc","dd","ee","ff","gg","hh","ii","jj","kk"],
    z: ["A","B","C","D","E","F","G","H","I","J","K"]
  }
};


function labelAxis(labelAxis){

  var axis = {
    x : 0,
    y : 0,
    z : 0
  };

  for ( var i = 0; i < 10; i ++ ) {

    var element = document.createElement( 'div' );
        element.textContent = data.labels[labelAxis][i];
        element.className = 'label';
        element.style.background = new THREE.Color( Math.random() * 0xffffff ).getStyle();

    var object = new THREE.CSS3DObject( element );
        object.position.x = axis.x
        object.position.y = axis.y;
        object.position.z = axis.z;
        if (labelAxis == "y"){

        } else {
          object.rotation.x = -90*Math.PI/180;
        }
        cssScene.add( object );
        axis[labelAxis]+=100;

  }

}



function gridInit(){
  /* GRIDS*/

  //GREEN
  var gridXZ = new THREE.GridHelper(500, 100);
  gridXZ.setColors( new THREE.Color(0x19C37F), new THREE.Color(0x19C37F) );
  gridXZ.position.set( 500,0,500 );
  glScene.add(gridXZ);

  //BLUE
  var gridXY = new THREE.GridHelper(500, 100);
  gridXY.position.set( 500,500,0 );
  gridXY.rotation.x = Math.PI/2;
  gridXY.setColors( new THREE.Color(0x1FC7FF), new THREE.Color(0x1FC7FF) );
  glScene.add(gridXY);


  //PINK
  var gridYZ = new THREE.GridHelper(500, 100);
  gridYZ.position.set( 0,500,500 );
  gridYZ.rotation.z = Math.PI/2;
  gridYZ.setColors( new THREE.Color(0xDD006C), new THREE.Color(0xDD006C) );
  glScene.add(gridYZ);
  
}



function init() {

  container = document.getElementById( 'container' );

  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
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
