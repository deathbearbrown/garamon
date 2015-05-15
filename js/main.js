if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container, stats;

var views, scene, renderer, camera;

var mesh, group1, group2, group3, light;

var mouseX = 0, mouseY = 0;

var windowWidth, windowHeight;

var setUpViews = {
  views: [
    {
      left: 0,
      bottom: 0,
      width: 0.5,
      height: 1.0,
      background: new THREE.Color().setRGB( 0.5, 0.5, 0.7 ), //main
      eye: [ 0, 0, 1800 ],
      up: [ 0, 1, 0 ],
      fov: 100,
      updateCamera: function ( camera, scene, mouseX, mouseY ) {
        camera.position.x += mouseX * 0.05;
        camera.position.x = Math.max( Math.min( camera.position.x, 2000 ), -2000 );
        camera.lookAt( scene.position );
      }
    },
    { 
      left: 0.5,
      bottom: 0,
      width: 0.5,
      height: 0.5,
      background: new THREE.Color().setRGB( 0.7, 0.5, 0.5 ), //pink TOP DOWN
      eye: [ 0, 1800, 0 ],
      up: [ 0, 0, 1 ],
      fov: 100,
      updateCamera: function ( camera, scene, mouseX, mouseY ) {
        camera.position.x -= mouseX * 0.05;
        camera.position.x = Math.max( Math.min( camera.position.x, 2000 ), -2000 );
        camera.lookAt( camera.position.clone().setY( 0 ) );
      }
    },
    { 
      left: 0.5,
      bottom: 0.5,
      width: 0.5,
      height: 0.5,
      background: new THREE.Color().setRGB( 0.5, 0.7, 0.7 ), //blue
      eye: [ 1400, 800, 1400 ],
      up: [ 0, 1, 0 ],
      fov: 100,
      updateCamera: function ( camera, scene, mouseX, mouseY ) {
        camera.position.y -= mouseX * 0.05;
        camera.position.y = Math.max( Math.min( camera.position.y, 1600 ), -1600 );
        camera.lookAt( scene.position );
      }
    }
  ],
  init: function(){
    var views = this.views;
    for (var ii =  0; ii < views.length; ++ii ) {
      var view = views[ii];
      camera = new THREE.PerspectiveCamera( view.fov, window.innerWidth / window.innerHeight, 1, 10000 );
      camera.position.x = view.eye[ 0 ];
      camera.position.y = view.eye[ 1 ];
      camera.position.z = view.eye[ 2 ];
      camera.up.x = view.up[ 0 ];
      camera.up.y = view.up[ 1 ];
      camera.up.z = view.up[ 2 ];
      view.camera = camera;
    }
  },
  render: function(){
    var views = this.views;
    for ( var ii = 0; ii < views.length; ++ii ) {
      view = views[ii];
      camera = view.camera;

      view.updateCamera( camera, scene, mouseX, mouseY );

      var left   = Math.floor( windowWidth  * view.left );
      var bottom = Math.floor( windowHeight * view.bottom );
      var width  = Math.floor( windowWidth  * view.width );
      var height = Math.floor( windowHeight * view.height );
      renderer.setViewport( left, bottom, width, height );
      renderer.setScissor( left, bottom, width, height );
      renderer.enableScissorTest ( true );
      renderer.setClearColor( view.background );

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.render( scene, camera );
    }
  }
};




function init() {

  container = document.getElementById( 'container' );

  //set up views
  setUpViews.init();


  //create a new scene
  scene = new THREE.Scene();


  light = new THREE.DirectionalLight( 0xffffff );
  light.position.set( 0, 0, 1 );
  scene.add( light );

  // create canvas
  var canvas = document.createElement( 'canvas' );
      canvas.width = 128;
      canvas.height = 128;

  var context = canvas.getContext( '2d' );


  /*Add a surface*/


  // create the plane mesh
  var material3 = new THREE.MeshBasicMaterial({ wireframe: true });
  var geometry3 = new THREE.PlaneGeometry();
  var planeMesh3= new THREE.Mesh( geometry3, material3 );
  // add it to the WebGL scene
  scene.add(planeMesh3);



  // create the dom Element
  var element3 = document.createElement( 'div' );
      element3.innerHTML = 'LABEL HERE';

  var cssObject = new THREE.CSS3DObject( element3 );
      cssObject.position = planeMesh3.position;
      cssObject.rotation = planeMesh3.rotation;
      scene.add(cssObject);

  var cssRenderer = new THREE.CSS3DRenderer();
      cssRenderer.setSize( window.innerWidth, window.innerHeight );
      cssRenderer.domElement.style.position = 'absolute';
      cssRenderer.domElement.style.top = 100;



  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );

  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0px';
  container.appendChild( stats.domElement );

  document.addEventListener( 'mousemove', onDocumentMouseMove, false );

}

function onDocumentMouseMove( event ) {

  mouseX = ( event.clientX - windowWidth / 4 );
  mouseY = ( event.clientY - windowHeight / 4 );

}

function updateSize() {

  if ( windowWidth != window.innerWidth || windowHeight != window.innerHeight ) {

    windowWidth  = window.innerWidth;
    windowHeight = window.innerHeight;

    renderer.setSize ( windowWidth, windowHeight );

  }

}

function animate() {

  render();
  stats.update();

  requestAnimationFrame( animate );
}

function render() {

  updateSize();
  setUpViews.render();

}

// SET THIS SHIT UP
init();
animate();
