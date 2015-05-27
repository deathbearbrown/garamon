if ( ! Detector.webgl ) Detector.addGetWebGLMessage();


var container, stats;

var views, glScene, glRenderer, camera, cssrenderer;
var cssScene, cssRenderer;

var light;

var mouseX = 0, mouseY = 0;

var windowWidth = $("#container").innerWidth(), 
		windowHeight = $("#container").innerHeight(); 

var realData;


var data = {
  labels: {
  	x: ["2%", "4%", "6%", "8%"],
    y: ["\'05","\'06","\'07","\'08","\'09","\'10","\'11","\'12","\'13","\'14","\'15"],
    z: ["1-month","3-month","6-month","1-year","2-year","3-year","5-year","7-year","10-year", "20-year","30-year"]
  }
};

$.getJSON( "../2005-2015.json", function( data ) {
	realData = data;
	init();
	render();
});

var graphDimensions = {
	w:1000,
	d:2405,
	h:800
};


function labelAxis(width, data, title){

  var separator = 2*width/data.length,
			z = separator;

	var dobj = new THREE.Object3D();
  for ( var i = 0; i < data.length; i ++ ) {

    var element = document.createElement( 'div' );
        element.textContent = data[i];
        element.className = 'label';

    var object = new THREE.CSS3DObject( element );
        object.position.x = 0
        object.position.y = 0;
        object.position.z = z;

        dobj.add( object );

        z+=separator;

  }
  return dobj;
}

//----------------------------------------------------------------------------
//  createAGrid
//
// opts
// {
// 	height: width, 
// 	width: depth,
// 	linesHeight: b,
// 	linesWidth: c,
// 	color: 0xcccccc
// }
//
//____________________________________________________________________________

function createAGrid(opts){
		var config = opts || {
			height: 500, 
			width: 500,
			linesHeight: 10,
			linesWidth: 10,
			color: 0xDD006C
		};

		var material = new THREE.LineBasicMaterial({ 
			color: config.color, 
			opacity: 0.2 
		});

		var gridObject = new THREE.Object3D(),
				gridGeo= new THREE.Geometry(),
				stepw = 2*config.width/config.linesWidth,
				steph = 2*config.height/config.linesHeight;

		//width
		for ( var i = - config.width; i <= config.width; i += stepw ) {
				gridGeo.vertices.push( new THREE.Vector3( - config.height, i,0 ) );
				gridGeo.vertices.push( new THREE.Vector3(  config.height, i,0 ) );

		}
		//height
		for ( var i = - config.height; i <= config.height; i += steph ) {
				gridGeo.vertices.push( new THREE.Vector3( i,- config.width,0 ) );
				gridGeo.vertices.push( new THREE.Vector3( i, config.width, 0 ) );
		}

		var line = new THREE.Line( gridGeo, material, THREE.LinePieces );
		gridObject.add(line);

		return gridObject;
}

//----------------------------------------------------------
// Initialize grids 
//----------------------------------------------------------


function gridInit(){

	var boundingGrid = new THREE.Object3D(),
			depth = graphDimensions.w/2, //depth
			width = graphDimensions.d/2, //width
			height = graphDimensions.h/2, //height
			a =data.labels.x.length,
			b= data.labels.y.length,
			c= data.labels.z.length;

	//pink
	var newGridXY = createAGrid({
				height: width, 
				width: height,
				linesHeight: b,
				linesWidth: a,
				color: 0xcccccc
			});
			//newGridXY.position.y = height;
	  	newGridXY.position.z = -depth;
			boundingGrid.add(newGridXY);

	//blue
	var newGridYZ = createAGrid({
				height: width, 
				width: depth,
				linesHeight: b,
				linesWidth: c,
				color: 0xcccccc
			});
	 		newGridYZ.rotation.x = Math.PI/2;
	 		newGridYZ.position.y = -height;
			boundingGrid.add(newGridYZ);

	//green
	var newGridXZ = createAGrid({
				height: depth, 
				width: height,
				linesHeight:c,
				linesWidth: a,
				color: 0xcccccc
			});

			newGridXZ.position.x = width;
			//newGridXZ.position.y = height;
	 		newGridXZ.rotation.y = Math.PI/2;
			boundingGrid.add(newGridXZ);

	glScene.add(boundingGrid);


	// var labelsW = labelAxis(width, data.labels.x);
	// cssScene.add(labelsW);
	// var labelsD = labelAxis(depth, data.labels.y);
	// var labelsH = labelAxis(height, data.labels.z);

};


function init() {

  container = document.getElementById( 'container' );


//----------------------------------------------------------------------------
//   Set up camera
//____________________________________________________________________________

	camera = new THREE.PerspectiveCamera( 30, windowWidth / windowHeight, 1, 30000 );
	camera.position.set(1207, 600, 3019);


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
//    data
//____________________________________________________________________________

	gridInit();

	var wireframeMaterial = new THREE.MeshBasicMaterial( { 
														side:THREE.DoubleSide,
														vertexColors: THREE.VertexColors
													}); 

	var lineMat = new THREE.LineBasicMaterial({
									color: 0xffffff
								});
	var blacklineMat = new THREE.LineBasicMaterial({
												color: 0x000000
											});

	var floorGeometry = new THREE.PlaneGeometry(graphDimensions.w,graphDimensions.d,10,2405);
	var colors = ["#eef4f8","#ddecf4","#cce5f0","#bcddec","#aed5e7","#a0cde2","#94c5dc","#89bcd6","#7eb4d0","#74abc9","#6aa2c2","#619abb","#5892b4","#4f8aad","#4781a6","#3f799f","#3a7195","#35688c","#326082","#2f5877","#2c506c","#243d52"];
	var faceColors = [];
	var lines={};

	// on plane Geometry, change the z value to create the 3D area surface
	// just like when creating a terrain 
	for (var i =0; i< floorGeometry.vertices.length; i++){

		//push colors to the faceColors array
		faceColors.push(colors[Math.round(realData[i][2]*4)]);

		if (realData[i][2] == null){
			//hack hack hack
			floorGeometry.vertices[i].z="null";
		}else{
			floorGeometry.vertices[i].z=realData[i][2]*100;
			if (!lines[floorGeometry.vertices[i].x]) { 
				lines[floorGeometry.vertices[i].x] = new THREE.Geometry();
			}
			//arrays for the grid lines
			lines[floorGeometry.vertices[i].x].vertices.push(new THREE.Vector3(floorGeometry.vertices[i].x, floorGeometry.vertices[i].y, realData[i][2]*100));
		}
	}

	//vertexColors
	for (var x= 0; x <floorGeometry.faces.length; x++){
		floorGeometry.faces[x].vertexColors[0] = new THREE.Color(faceColors[floorGeometry.faces[x].a]);
		floorGeometry.faces[x].vertexColors[1] = new THREE.Color(faceColors[floorGeometry.faces[x].b]);
		floorGeometry.faces[x].vertexColors[2] = new THREE.Color(faceColors[floorGeometry.faces[x].c]);
	}

	//grid lines
	for (line in lines){
		if (line == "-500"){
			var graphLine= new THREE.Line(lines[line], blacklineMat);
		}else{
			var graphLine= new THREE.Line(lines[line], lineMat);
		}

		graphLine.rotation.x = -Math.PI/2;
		graphLine.position.y = -graphDimensions.h/2;

		graphLine.rotation.z = Math.PI/2;

		glScene.add(graphLine);
	}

//	var bufferG = new THREE.BufferGeometry().fromGeometry(floorGeometry);

	var floor = new THREE.Mesh(floorGeometry, wireframeMaterial);
		floor.rotation.x = -Math.PI/2;
		floor.position.y = -graphDimensions.h/2;

		floor.rotation.z = Math.PI/2;
	glScene.add(floor);

//----------------------------------------------------------------------------
//    SET UP RENDERERS
//____________________________________________________________________________

  //set up webGL renderer
  glRenderer = new THREE.WebGLRenderer();
  glRenderer.setPixelRatio( window.devicePixelRatio );
  glRenderer.setClearColor( 0xf0f0f0 );
  glRenderer.setSize( windowWidth, windowHeight);
  container.appendChild( glRenderer.domElement );

  //set up CSS renderer
  cssRenderer = new THREE.CSS3DRenderer();
  cssRenderer.setSize( windowWidth, windowHeight);
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

	camera.aspect = windowWidth / windowHeight;
	camera.updateProjectionMatrix();

	glRenderer.setSize( windowWidth, windowHeight );
	cssRenderer.setSize( windowWidth, windowHeight );

	render();

}


//----------------------------------------------------------------------------
//    Camera controls
//____________________________________________________________________________

  $(".buttons").bind('click',function(){ 
  	if ($(this).attr('id')=="camera-1"){
  		console.log("camera one");
  		//controls.reset();
  		camera.fov = 30;
			camera.position.set(1149.8830275661012, 531.6122496479234, 505.4931375393053);
  	}

		if ($(this).attr('id')=="camera-2"){
			console.log("camera two");
			controls.reset();
			camera.fov = 60;
			camera.updateProjectionMatrix();
			camera.position.z = 2000;
		}

		if ($(this).attr('id')=="camera-3"){
  		console.log("camera three");
  		controls.reset();
  		camera.fov = 60;
			camera.updateProjectionMatrix();
			camera.position.z = 1500;
  	}

  	if ($(this).attr('id')=="camera-4"){
  		console.log("camera four");
  		controls.reset();
  		camera.fov = 60;
			camera.updateProjectionMatrix();
			camera.position.z = 1000;
  	}

  });
