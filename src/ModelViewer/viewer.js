import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'


    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);
    
    const ambientLight = new THREE.AmbientLight(0xffffff, .7)
    scene.add(ambientLight)
    
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
    
    
    var floorgeometry = new THREE.CircleGeometry(2, 80);
    var floormaterial = new THREE.MeshPhongMaterial({
        color: 0xdddddd,
        shininess: 20
    });

    const floor = new THREE.Mesh(floorgeometry, floormaterial);
    floor.rotation.x = -Math.PI * 0.5;
    floor.position.z = 0;
    floor.position.x = 0;
    floor.position.y = 0;
    floor.receiveShadow = true;
    scene.add(floor);

    let model = null



export default function viewer(canvasRef) {
    const renderer = new THREE.WebGLRenderer({
        canvas: canvasRef,
        antialias: true,
    });

    renderer.setSize(canvasRef.clientWidth, canvasRef.clientHeight);
    renderer.shadowMap.enabled = true;


    const camera = new THREE.PerspectiveCamera(75, canvasRef.clientWidth / canvasRef.clientHeight, 0.1, 1000 );
    camera.position.set(-1, 1, -2)
    
    const controls = new OrbitControls(camera, canvasRef)
    controls.enablePan = false;
    controls.minDistance = 1;
    controls.maxDistance = 10; 
  
    var mixer = undefined

    const clock = new THREE.Clock()
    clock.start();

    function update() {
        const delta = clock.getDelta();
        renderer.render(scene, camera)
    
        if (mixer)
            mixer.update(delta)
        
        requestAnimationFrame(update);
    }
    
    const gltfLoader = new GLTFLoader()
    
    gltfLoader.load(
        process.env.PUBLIC_URL + '/models/pig/pig.gltf',
        (gltf) => {
            if (model) {
                model.traverse(function(node) {
                    if (node.isMesh) {
                        if (model.geometry)
                            model.geometry.dispose()
                        if (model.material)
                            model.material.dispose()
                    }
                });
                scene.remove(model)
            }
            model = gltf.scene
            gltf.scene.traverse(function(node) {
                if (node.isMesh) {
                    node.receiveShadow = true;
                    node.castShadow = true;
                }
            });
            
            mixer = new THREE.AnimationMixer(gltf.scene)
            mixer.clipAction(gltf.animations[0]).play()
            scene.add(gltf.scene)
        })
        
    update();

    const setModel = (file) => {
        const url = URL.createObjectURL(file);
        gltfLoader.load(
            url,
            (gltf) => {
                URL.revokeObjectURL(url);

                if (model) {
                    scene.remove(model)
                }
                
                gltf.scene.traverse(function(node) {
                    if (node.isMesh) {
                        node.receiveShadow = true;
                        node.castShadow = true;
                    }
                } );
                
                mixer = new THREE.AnimationMixer(gltf.scene)
                
                mixer.clipAction(gltf.animations[0]).play()
                
                scene.add(gltf.scene)
                
            }, function onProgress(){  }, function onError(){ 
                URL.revokeObjectURL(url);
            });
    }

    const dispose = () => {
        renderer.dispose()
        dirLight.shadow.dispose()
        floor.geometry.dispose()
        floormaterial.dispose()
        scene.remove(model)
        scene.traverse(function(node) {
            if (node.isMesh) {
                node.geometry.dispose()
                node.material.dispose()
                // node.dispose()
            }
        })
        console.log(renderer.info)

    }

    return {setModel, dispose}
}