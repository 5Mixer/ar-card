import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

    import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
    import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass.js';

export default function viewer(canvasRef) {
    
    const renderer = new THREE.WebGLRenderer({
        canvas: canvasRef,
        antialias: true,
    });
    renderer.setSize(500, 500);
    renderer.shadowMap.enabled = true;
    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);
    
    const ambientLight = new THREE.AmbientLight(0xffffff, .7)
    scene.add(ambientLight)
    
    
    const point = new THREE.PointLight(0xffffff, .8)
    point.position.set(-15, 20, -10)
    // point.castShadow = true
    
    // scene.add(point);
    
    const dirLight = new THREE.DirectionalLight(0xffffff, .8)
    dirLight.position.set(3, 3, -3)
    dirLight.castShadow = true

    dirLight.shadow.camera.top = 2;
    dirLight.shadow.camera.bottom = -2;
    dirLight.shadow.camera.left = -2;
    dirLight.shadow.camera.right = 2;
    dirLight.shadow.camera.near = .02;
    dirLight.shadow.camera.far = 10;
    dirLight.shadow.bias = -0.003;
    dirLight.shadow.mapSize.set(1024, 1024)
    
    scene.add(dirLight)
    
    
    const camera = new THREE.PerspectiveCamera(75, canvasRef.width / canvasRef.height, 0.1, 1000 );
    camera.position.set(-1, 1, -2)
    camera.lookAt(0,0,0)
    
    
    const controls = new OrbitControls(camera, canvasRef)
    controls.enablePan = false;
    controls.minDistance = 1;
    controls.maxDistance = 10; 
    // controls.target.set(0, 1, 0)
    
    // Create meshes, materials, etc.
    
    const geometry = new THREE.BoxGeometry(10,10,10);
    const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    const cube = new THREE.Mesh(geometry, material);
    cube.castShadow=true
    // scene.add(cube);
    
    
    var floorgeometry = new THREE.CircleGeometry(2, 50);
    var floormaterial = new THREE.MeshPhongMaterial({
        color: 0xdddddd,
        shininess: 20,
        wireframe: false
    });
    var floor = new THREE.Mesh(floorgeometry, floormaterial);
    //   floor.material.side = THREE.DoubleSide;
    floor.rotation.x = -Math.PI * 0.5;
    floor.position.z = 0;
    floor.position.x = 0;
    floor.position.y = 0;
    floor.receiveShadow = true;
    scene.add(floor);


    const composer = new EffectComposer( renderer );

    const ssao = false;
    const ssaoPass = new SSAOPass( scene, camera, canvasRef.width, canvasRef.height );
    ssaoPass.kernelRadius = 1;
    ssaoPass.minDistance = .0000001;
    ssaoPass.maxDistance = 0.0001;
    composer.addPass(ssaoPass);

    let mixer = undefined
    let activeAction = null
    
    function update() {
        ssao ? composer.render() : renderer.render(scene, camera);
    
        if (mixer)
            mixer.update(1/60)
        
        requestAnimationFrame(update);
    }
    
    const gltfLoader = new GLTFLoader()
    
    gltfLoader.load(
        process.env.PUBLIC_URL + '/models/pig/pig.gltf',
        (gltf) => {
            
            gltf.scene.traverse(function(node) {
                if (node.isMesh) {
                    node.receiveShadow = true;
                    node.castShadow = true;
                }
            } );
            
            mixer = new THREE.AnimationMixer(gltf.scene)
            
            mixer.clipAction(gltf.animations[0]).play()
            
            scene.add(gltf.scene)
            
        })
        
        update();
        
    }