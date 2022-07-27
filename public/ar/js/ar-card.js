var scene, camera, renderer, clock, deltaTime, totalTime, mixer;
var arToolkitSource, arToolkitContext;

function initialize(cards) {
	scene = new THREE.Scene();

	let ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
	scene.add(ambientLight);
				
	camera = new THREE.Camera();
	scene.add(camera);

	renderer = new THREE.WebGLRenderer({
		antialias : true,
		alpha: true
	});

	renderer.setClearColor(new THREE.Color('lightgrey'), 0)
	renderer.setSize(640, 480);
	renderer.domElement.style.position = 'absolute';
	renderer.domElement.style.top = '0px';
	renderer.domElement.style.left = '0px';
	document.body.appendChild(renderer.domElement);

	clock = new THREE.Clock();
	deltaTime = 0;
	totalTime = 0;

	arToolkitSource = new THREEx.ArToolkitSource({
		sourceType : 'webcam',
	});

	function onResize() {
		arToolkitSource.onResize();
		arToolkitSource.copySizeTo(renderer.domElement);

		if (arToolkitContext.arController !== null) {
			arToolkitSource.copySizeTo(arToolkitContext.arController.canvas);
		}
	}

	arToolkitSource.init(function onReady(){
		onResize();
	});
	
	// handle resize event
	window.addEventListener('resize', function(){
		onResize();
	});
	
	// create atToolkitContext
	arToolkitContext = new THREEx.ArToolkitContext({
		cameraParametersUrl: 'data/camera_para.dat',
		detectionMode: 'mono',
		// debug: true,
		patternRatio: .6
	});
	
	// copy projection matrix to camera when initialization complete
	arToolkitContext.init(function onCompleted(){
		camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
	});

	// build markerControls
	for (const card of cards) {
		const markerRoot = new THREE.Group();
		scene.add(markerRoot);

		const markerControls = new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
			type: 'pattern', patternUrl: `/api/pattern/${card.id}`,
		});


		var loader = new THREE.GLTFLoader();
		loader.crossOrigin = true;
		loader.load(`/api/model/${card.id}`, function (data) {
			const gltf = data.scene;

			if (data.animations.length > 0) {
				mixer = new THREE.AnimationMixer(gltf)
				mixer.clipAction(data.animations[0]).play()
			}

			markerRoot.add(gltf);
		}, function progress(){}, function (err) {
			console.error(err)
		});
	}
}

function update(delta) {
	if (arToolkitSource.ready !== false) {
		arToolkitContext.update(arToolkitSource.domElement);
        
        if (mixer) {
            mixer.update(delta)
		}
	}
}

function render() {
	renderer.render(scene, camera);
}

function animate() {
	requestAnimationFrame(animate);
	deltaTime = clock.getDelta();
	totalTime += deltaTime;
	update(deltaTime);
	render();
}

window.addEventListener('load', function() {
	fetch('/api/valid-cards')
		.then(function(response) {
			return response.json();
		})
		.then(function(cards) {
			initialize(cards);
			animate();
		})
});
