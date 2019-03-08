<html>
	<head>
		<title>My first three.js app</title>
		<style>
			body { margin: 0; }
			canvas { width: 100%; height: 100% }
		</style>
	</head>
	<body onload="init()">
		<script src="js/three.js"></script>
    <script src="js/OrbitControls.js"></script>
		<script src="js/OBJLoader.js"></script>
		<script src="js/MTLLoader.js"></script>
		<script src="js/Angle.js"></script>
		<script src="js/svgPlot.js"></script>
		<script>
		//FRAME RATE TAB
(function() {
	var script = document.createElement('script');
	script.onload = function() {
			var stats = new Stats();
			document.body.appendChild(stats.dom);
			requestAnimationFrame
					(function loop() {
							stats.update();
							requestAnimationFrame(loop)
					});
	};
	script.src = '//mrdoob.github.io/stats.js/build/stats.min.js';
	document.head.appendChild(script);
})()

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); //(fov, aspect ratio,near clipping plane,far clipping plane)
var renderer = new THREE.WebGLRenderer(); // the three.js renderer
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
renderer.setSize(window.innerWidth, window.innerHeight); //setting the size of the renderer
document.body.appendChild(renderer.domElement); // add a render element to the browser

//INTERACTIVE WINDOW SIZE
window.addEventListener('resize', function() {
	var width = window.innerWidth;
	var height = window.innerHeight;
	renderer.setSize(width, height);
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
})
//
clock = new THREE.Clock();

controls = new THREE.OrbitControls(camera, renderer.domElement); // set OrbitControls

// add lightningt to the scene: hsl= hue/satuaration/lightness/level
var directLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 100%)'), 0.3, 0, Math.PI / 2., 0, 2);
directLight.position.set(0, 100, 200);
directLight.castShadow = true;

var ambientLight = new THREE.AmbientLight(new THREE.Color('rgb(255, 255, 255)'), 0.5); // soft white light

scene.add(ambientLight);
scene.add(directLight);

var mtlLoaderCog = new THREE.MTLLoader();
var mtlLoaderAnchor = new THREE.MTLLoader();
var objLoaderAnchor = new THREE.OBJLoader();
var objLoaderCog = new THREE.OBJLoader();

mtlLoaderAnchor.setTexturePath('/assets/');
mtlLoaderAnchor.setPath('/assets/');
mtlLoaderAnchor.load('hook4.mtl', function(anchorMaterials) {

	anchorMaterials.preload();
	objLoaderAnchor.setMaterials(anchorMaterials);
	objLoaderAnchor.setPath('/assets/');
	objLoaderAnchor.load('anchor.obj', function(AnchorObject) {
			anchor = AnchorObject;
			anchor.translateY(1.45);
			anchor.translateZ(1.98);
			anchor.rotateX(1.57079633);
			scene.add(AnchorObject);
	});
});

mtlLoaderCog.setTexturePath('/assets/');
mtlLoaderCog.setPath('/assets/');
mtlLoaderCog.load('cog2.mtl', function(cogMaterials) {

	cogMaterials.preload();
	objLoaderCog.setMaterials(cogMaterials);
	objLoaderCog.setPath('/assets/');
	objLoaderCog.load('cog2.obj', function(cogObject) {
			cog = cogObject;
			cog.rotateZ(1.57079633);
			cog.rotateX(1.57079633);
			cog.translateY(2);
			cog.traverse(function(child) {
					if (child instanceof THREE.Mesh) {
							child.castShadow = true;
					}
			}); //shadow
			scene.add(cog);

	});
});

var floorGeometry = new THREE.PlaneBufferGeometry(30, 30, 32, 32); // create the geometry for a cube with size 1,1,1 in x,y,z, BoxGeometry contains all the vertices for a cube
var floorMaterial = new THREE.MeshStandardMaterial({
	color: 0x00ff00
}); // create a material to color the cube
var floor = new THREE.Mesh(floorGeometry, floorMaterial); // create a mesh, a mesh is an objects that takes a geometry and applies a material to it/
var wallGeometry = new THREE.PlaneBufferGeometry(30, 30, 32, 32);
var wallMaterial = new THREE.MeshStandardMaterial({
	color: 0x00ff00
});
var wall = new THREE.Mesh(wallGeometry, wallMaterial);
floor.rotateX(30);
floor.translateZ(-10);
floor.receiveShadow = true;
wall.receiveShadow = true;
scene.add(floor); // add the cube mesh to the scene we will be rendering
scene.add(wall);

time = new THREE.Clock();
time.start;
var lastTime;

var p1 = new Pendulum(-0.5, 0, 1, 1, 1, 0.04, 1);
var c1 = new Cog(0, 0, 1);

var thisUpdate = 0;
var lastUpdate = 0;

function updateAngle() {
	thisUpdate = time.getElapsedTime();
	var numUpdates = Math.floor((thisUpdate - lastUpdate) / h);
	//console.log(numUpdates);
	lastUpdate = thisUpdate;


	for (i = 0; i < numUpdates; i++) {
			p1.update();
			c1.update(p1.get_impulse_force());
	}

};

camera.position.z = 10; // move out in the z-plane so we don't clash with the cube

var animate = function() { // create a render loop that updates the scene 60 times/sec (where the screen is refreshed)
	//console.log(Math.round(clock.getElapsedTime()));
	requestAnimationFrame(animate); //requestAnimationFrame is the same as setInterval but with a few advantages, one of them being that it stops when the user navigates to another tab

	var prevCogAngle = c1.angle;
	updateAngle();
	var newAngle = c1.angle - prevCogAngle;

	cog.rotateY(-newAngle);

	renderer.render(scene, camera); // render the scene
};

animate(); // call the render loop
			//FRAME RATE TAB
			(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame
				(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})()

			var scene = new THREE.Scene();
			var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 ); //(fov, aspect ratio,near clipping plane,far clipping plane)
			var renderer = new THREE.WebGLRenderer(); // the three.js renderer
			renderer.shadowMap.enabled = true;
			renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
			renderer.setSize( window.innerWidth, window.innerHeight ); //setting the size of the renderer
			document.body.appendChild( renderer.domElement ); // add a render element to the browser

			//INTERACTIVE WINDOW SIZE
      window.addEventListener('resize', function()
      {
        var width = window.innerWidth;
        var height = window.innerHeight;
        renderer.setSize(width,height);
        camera.aspect = width/height;
        camera.updateProjectionMatrix();
      })
			//
			clock = new THREE.Clock();

      controls = new THREE.OrbitControls(camera, renderer.domElement);  // set OrbitControls

			// add lightningt to the scene: hsl= hue/satuaration/lightness/level
			var skyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'),1.0);
			skyLight.position.set(-200,100,100); //change posistion of the light source

			var directLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 100%)'),0.3, 0 ,Math.PI/2., 0, 2);
			directLight.position.set(100,50,100);
			directLight.castShadow = true;

			var ambientLight = new THREE.AmbientLight(new THREE.Color('rgb(255, 255, 255)') , 0.5); // soft white light

			//scene.add(ambientLight);
			scene.add(skyLight);
			scene.add(directLight);

			var mtlLoader = new THREE.MTLLoader();
			mtlLoader.setTexturePath('/assets/');
			mtlLoader.setPath('/assets/');
			mtlLoader.load('cog2.mtl', function(materials){

				materials.preload();
				var objLoader = new THREE.OBJLoader();
				objLoader.setMaterials(materials);
				objLoader.setPath('/assets/');
				objLoader.load('cog2.obj', function(object){

				cog = object;
				cog.rotateZ(1.57079633);
				cog.rotateX(1.57079633);
				cog.translateY(2);
				cog.traverse( function (child){if (child instanceof THREE.Mesh){child.castShadow = true;}}); //shadow
				scene.add(cog)
				});
		 });

			var floorGeometry = new THREE.PlaneBufferGeometry( 30, 30, 32, 32 ); // create the geometry for a cube with size 1,1,1 in x,y,z, BoxGeometry contains all the vertices for a cube
			var floorMaterial = new THREE.MeshStandardMaterial( { color: 0x00ff00 } ); // create a material to color the cube
			var floor = new THREE.Mesh( floorGeometry, floorMaterial ); // create a mesh, a mesh is an objects that takes a geometry and applies a material to it/
			var wallGeometry = new THREE.PlaneBufferGeometry(30, 30, 32, 32);
			var wallMaterial = new THREE.MeshStandardMaterial ({color: 0x00ff00 });
			var wall = new THREE.Mesh(wallGeometry, wallMaterial);
			floor.rotateX(30);
			floor.translateZ(-10);
			floor.receiveShadow = true;
			wall.receiveShadow = true;
			scene.add(floor); // add the cube mesh to the scene we will be rendering
			scene.add(wall);

			time = new THREE.Clock();
			time.start;
			var lastTime;

			var p1 = new Pendulum(-0.5, 0, 1, 1, 1, 0.04, 1);
			var c1 = new Cog(0, 0, 1);

			var thisUpdate = 0;
			var lastUpdate = 0;

			function updateAngle(){
				thisUpdate = time.getElapsedTime();
				var numUpdates = Math.floor((thisUpdate - lastUpdate) / h);
				console.log(numUpdates);
				lastUpdate = thisUpdate;


				for(i = 0; i < numUpdates; i++){
					p1.update();
					c1.update(p1.get_impulse_force());
				}

			};

			camera.position.z = 10; // move out in the z-plane so we don't clash with the cube

			var animate = function () { // create a render loop that updates the scene 60 times/sec (where the screen is refreshed)
				//console.log(Math.round(clock.getElapsedTime()));
				requestAnimationFrame( animate ); //requestAnimationFrame is the same as setInterval but with a few advantages, one of them being that it stops when the user navigates to another tab

				var prevCogAngle = c1.angle;
				updateAngle();
				var newAngle = c1.angle - prevCogAngle;
				console.log(newAngle);
				pushPlot(c1.velocity, cogPlot, plotMaxValues); //Add value to the array for the plot
				plotArray(plot, cogPlot, green); //Plot the array

				cog.rotateY(-newAngle);

				renderer.render( scene, camera ); // render the scene
			};

			animate(); // call the render loop
		</script>
		<svg id="plot" height="300" width="500" style="z-index:20000; position: absolute; right:0; bottom:0; background-color: rgba(0,0,0,0.2);"></svg>
	</body>
</html>
