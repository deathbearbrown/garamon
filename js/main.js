if ( ! Detector.webgl ) Detector.addGetWebGLMessage();


var container, stats;

var views, glScene, glRenderer, camera, cssrenderer;
var cssScene, cssRenderer;

var light;

var mouseX = 0, mouseY = 0;

var windowWidth = window.innerWidth, 
		windowHeight = window.innerHeight;

var realData;


var data = {
  labels: {
  	x: ["2%", "4%", "6%", "8%"],
    y: ["\'05","\'06","\'07","\'08","\'09","\'10","\'11","\'12","\'13","\'14","\'15"],
    z: ["1-month","3-month","6-month","1-year","2-year","3-year","5-year","7-year","10-year", "20-year","30-year"]
  },
  us:[48,83,163,184,302,303,549,550,663,729,730, 849,858,890,973,1001,1063,1087,1130,1213,1254,1436,1586,1629,1630,1672,1768,1821,1852,1905,1951,1985,1986,2082,2145,2215,2216,2247,2290,2293,2372,2373,2404,2457,2590,2595,2598,2684,2716,2717,2785,2856,2878,2881,2992,2998,3062,3093,3203,3204,3229,3257,3258,3306,3419,3420,3467,3480,3503,3593,3613,3694,3731,3809,3839,3902,3903,3964,4092,4124,4205,4270,4323,4364,4449,4450,4451,4499,4536,4616,4617,4790,4791,4861,4863,4904,4905,4958,5003,5004,5067,5068,5178,5243,5251,5280,5323,5380,5400,5461,5462,5557,5558,5663,5683,5684,5711,5801,5882,5925,5952,6004,6067,6068,6119,6149,6184,6218,6248,6298,6299]
};

$.getJSON( "../2005-2015.json", function( data ) {
	realData = data;
// SET THIS SHIT UP
	init();
	render();
});

var graphDimensions = {
	w:1000,
	d:2405
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




function gridInit(){

	var boundingGrid = new THREE.Object3D(),
			depth = graphDimensions.w/2, //depth
			width = graphDimensions.d/2, //width
			height = 400, //height
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
			newGridXY.position.y = height;
	  	newGridXY.position.x = -width;
			boundingGrid.add(newGridXY);

	//blue
	var newGridYZ = createAGrid({
				height: width, 
				width: depth,
				linesHeight: b,
				linesWidth: c,
				color: 0xcccccc
			});
			newGridYZ.position.z = depth;
			newGridYZ.position.x = -width;
	 		newGridYZ.rotation.x = Math.PI/2;
			boundingGrid.add(newGridYZ);

	//green
	var newGridXZ = createAGrid({
				height: depth, 
				width: height,
				linesHeight:c,
				linesWidth: a,
				color: 0xcccccc
			});

			newGridXZ.position.z= depth;
			newGridXZ.position.y= height;
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

	camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 30000 );
	camera.position.set(1207, 600, 3019);


	controls = new THREE.OrbitControls( camera );
	controls.damping = 0.2;
	controls.addEventListener( 'change', render );
//	controls.center = new THREE.Vector3(-790.2369893225884, 272.3081911433925,-111.93158124722541);



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
	for (var i =0; i< floorGeometry.vertices.length; i++){
		

		faceColors.push(colors[Math.round(realData[i][2]*4)]);
		//console.log(Math.round(realData[i][2]*0.5));
		if (realData[i][2] == null){
			floorGeometry.vertices[i].z="rgba(0,0,0,0)";
		}else{
			floorGeometry.vertices[i].z=realData[i][2]*100;
			if (!lines[floorGeometry.vertices[i].x]) { 
				lines[floorGeometry.vertices[i].x] = new THREE.Geometry();
			}
			lines[floorGeometry.vertices[i].x].vertices.push(new THREE.Vector3(floorGeometry.vertices[i].x, floorGeometry.vertices[i].y, realData[i][2]*100));
		}

	}

	for (var x= 0; x <floorGeometry.faces.length; x++){
		floorGeometry.faces[x].vertexColors[0] = new THREE.Color(faceColors[floorGeometry.faces[x].a]);
		floorGeometry.faces[x].vertexColors[1] = new THREE.Color(faceColors[floorGeometry.faces[x].b]);
		floorGeometry.faces[x].vertexColors[2] = new THREE.Color(faceColors[floorGeometry.faces[x].c]);
		//floorGeometry.faces[x].color= new THREE.Color(colors[Math.round(Math.random()*colors.length)]);
	}

	for (line in lines){
		if (line == "-500"){
			var graphLine= new THREE.Line(lines[line], blacklineMat);
		}else{
			var graphLine= new THREE.Line(lines[line], lineMat);
		}

		graphLine.rotation.x = -Math.PI/2;
		graphLine.position.z = graphDimensions.w/2;
		graphLine.position.x = -graphDimensions.d/2;
		graphLine.rotation.z = Math.PI/2;

		glScene.add(graphLine);
	}

//	var bufferG = new THREE.BufferGeometry().fromGeometry(floorGeometry);

	var floor = new THREE.Mesh(floorGeometry, wireframeMaterial);
		floor.rotation.x = -Math.PI/2;
		floor.position.z = graphDimensions.w/2;
		floor.position.x = -graphDimensions.d/2;
		floor.rotation.z = Math.PI/2;
	glScene.add(floor);

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
