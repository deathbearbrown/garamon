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
    z: ["\'05","\'06","\'07","\'08","\'09","\'10","\'11","\'12","\'13","\'14","\'15"],
    y: ["2%", "4%", "6%", "8%"]
  },
  us:[48,83,163,184,302,303,549,550,663,729,730, 849,858,890,973,1001,1063,1087,1130,1213,1254,1436,1586,1629,1630,1672,1768,1821,1852,1905,1951,1985,1986,2082,2145,2215,2216,2247,2290,2293,2372,2373,2404,2457,2590,2595,2598,2684,2716,2717,2785,2856,2878,2881,2992,2998,3062,3093,3203,3204,3229,3257,3258,3306,3419,3420,3467,3480,3503,3593,3613,3694,3731,3809,3839,3902,3903,3964,4092,4124,4205,4270,4323,4364,4449,4450,4451,4499,4536,4616,4617,4790,4791,4861,4863,4904,4905,4958,5003,5004,5067,5068,5178,5243,5251,5280,5323,5380,5400,5461,5462,5557,5558,5663,5683,5684,5711,5801,5882,5925,5952,6004,6067,6068,6119,6149,6184,6218,6248,6298,6299]
};


// SET THIS SHIT UP
	init();
	render();

function labelAxis(labelAxis){
  var axis = {
    x : 0,
    y : 0,
    z : 0
  },
  separator = (Math.ceil((500/data.labels[labelAxis].length))*2);

  axis[labelAxis] = separator;

  for ( var i = 0; i < data.labels[labelAxis].length; i ++ ) {

    var element = document.createElement( 'div' );
        element.textContent = data.labels[labelAxis][i];
        element.className = 'label';

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
				if(labelAxis == "y"){
					 object.position.x = 1150;
				}
        if (labelAxis == "x"){
          object.rotation.z = -270*Math.PI/180;
          object.position.z = -50;
        }

        cssScene.add( object );

        axis[labelAxis]+=separator;

  }


}

function newCreateGrid(grid){
	  /* GRIDS*/

// Grid

		var size = 1000, step = 50;


		var zgrid = new THREE.Object3D();
		var zgridGeo = new THREE.Geometry();

		for ( var i = - size; i <= size; i += step ) {

				zgridGeo.vertices.push( new THREE.Vector3( - size, 0, i ) );
				zgridGeo.vertices.push( new THREE.Vector3(   size, 0, i ) );

				zgridGeo.vertices.push( new THREE.Vector3( i, 0, - size ) );
				zgridGeo.vertices.push( new THREE.Vector3( i, 0,   size ) );

		}

		var red = new THREE.LineBasicMaterial( { color: 0xff0000, opacity: 0.2 } );

		var line = new THREE.Line( zgridGeo, red, THREE.LinePieces );

		zgrid.add( line );
		zgrid.position.x = -size;
		zgrid.position.y = -size;


		var xgrid = new THREE.Object3D();
		var xgridGeo = new THREE.Geometry();

		for ( var i = - size; i <= size; i += step ) {

				xgridGeo.vertices.push( new THREE.Vector3( 0, - size, i ) );
				xgridGeo.vertices.push( new THREE.Vector3( 0, size, i ) );

				xgridGeo.vertices.push( new THREE.Vector3( 0, i, - size ) );
				xgridGeo.vertices.push( new THREE.Vector3( 0, i, size ) );

		}

		var green = new THREE.LineBasicMaterial( { color: 0x00ff00, opacity: 0.2 } );

		var newline = new THREE.Line( xgridGeo, green, THREE.LinePieces );

		xgrid.add( newline );


		var ygrid = new THREE.Object3D();
		var ygridGeo = new THREE.Geometry();

		for ( var i = - size; i <= size; i += step ) {

				ygridGeo.vertices.push( new THREE.Vector3( - size, i,0 ) );
				ygridGeo.vertices.push( new THREE.Vector3(  size, i,0 ) );

				ygridGeo.vertices.push( new THREE.Vector3( i, - size,0 ) );
				ygridGeo.vertices.push( new THREE.Vector3( i, size,0 ) );

		}

		var blue = new THREE.LineBasicMaterial( { color: 0x0000ff, opacity: 0.2 } );

		var newline1 = new THREE.Line( ygridGeo, blue, THREE.LinePieces );

		ygrid.add( newline1 );
		ygrid.position.x = -size;
		ygrid.position.z = -size;

		grid.add(zgrid);
		grid.add(xgrid);
		grid.add(ygrid);

}

function createGrids(){
  var size = 500;
  //GREEN
  var gridXZ = new THREE.GridHelper(size, (Math.ceil(size / data.labels.x.length ))*2);
  gridXZ.setColors( new THREE.Color(0x19C37F), new THREE.Color(0x19C37F) );
  gridXZ.position.set( -size, -size/2, size );
  glScene.add(gridXZ);


  //BLUE
  var gridXY = new THREE.GridHelper(size, (Math.ceil(size / data.labels.y.length))*2);
  gridXY.position.set( -size, size, -size/2 );
  gridXY.rotation.x = Math.PI/2;
  gridXY.setColors( new THREE.Color(0x1FC7FF), new THREE.Color(0x1FC7FF) );
	glScene.add(gridXY);

  //PINK
  var gridYZ = new THREE.GridHelper(size, (Math.ceil(size / data.labels.z.length))*2);
  gridYZ.position.set( -size/2, size, -size);
  gridYZ.rotation.z = Math.PI/2;
  gridYZ.setColors( new THREE.Color(0xDD006C), new THREE.Color(0xDD006C) );
  glScene.add(gridYZ);
  
}


function gridInit(){
	var grid = new THREE.Object3D();
	newCreateGrid(grid);

	grid.position.x= 500;
	glScene.add(grid);
	
	//createGrids();
	


	// labelAxis("x");
	// labelAxis("y");
	// labelAxis("z");

};


function init() {

  container = document.getElementById( 'container' );


//----------------------------------------------------------------------------
//   Set up camera
//____________________________________________________________________________

	camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 30000 );
	camera.position.z = 500;

	controls = new THREE.OrbitControls( camera );
	controls.damping = 0.2;
	controls.addEventListener( 'change', render );



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

	gridInit();
		

  geometry = new THREE.BoxGeometry( 200, 200, 200 );
  material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

  mesh = new THREE.Mesh( geometry, material );
  glScene.add( mesh );

//----------------------------------------------------------------------------
//    SET UP RENDERERS
//____________________________________________________________________________

  //set up webGL renderer
  glRenderer = new THREE.WebGLRenderer();
  glRenderer.setPixelRatio( window.devicePixelRatio );
  glRenderer.setClearColor( 0xf0f0f0 );
  glRenderer.setSize( window.innerWidth, window.innerHeight);
  container.appendChild( glRenderer.domElement );

  //set up CSS renderer
  cssRenderer = new THREE.CSS3DRenderer();
  cssRenderer.setSize( window.innerWidth, window.innerHeight);
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



	// set up window resize listener 
	window.addEventListener( 'resize', onWindowResize, false );
	animate();
}



//----------------------------------------------------------------------------
//	Animate
//----------------------------------------------------------------------------

function animate() {

	requestAnimationFrame(animate);
	controls.update();

}

function render() {

	cssRenderer.render( cssScene, camera );
	glRenderer.render( glScene, camera );
	//stats.update();

}


//----------------------------------------------------------------------------
// ON RESIZE
//----------------------------------------------------------------------------
function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	glRenderer.setSize( window.innerWidth, window.innerHeight );
	cssRenderer.setSize( window.innerWidth, window.innerHeight );

	render();

}


//----------------------------------------------------------------------------
//    Camera controls
//____________________________________________________________________________

  $(".buttons").bind('click',function(){ 
  	if ($(this).attr('id')=="camera-1"){
  		console.log("camera one");
			camera.rotation.x = - Math.PI / 2;
			camera.rotation.y = 0;
			camera.rotation.z = 0;

  	}

		if ($(this).attr('id')=="camera-2"){
			console.log("camera two");
			camera.position.x = 100;
		}

		if ($(this).attr('id')=="camera-3"){
  		console.log("camera three");
			camera.position.x = 500;
  	}

  	if ($(this).attr('id')=="camera-4"){
  		console.log("camera four");
			camera.position.x = 700;
  	}

  });
