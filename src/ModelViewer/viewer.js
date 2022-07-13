import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

var scene, ambientLight, dirLight, floorGeometry, floorMaterial, floor;
var model;

function initialiseScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xcccccc);
    
    ambientLight = new THREE.AmbientLight(0xffffff, .7)
    scene.add(ambientLight)
    
    dirLight = new THREE.DirectionalLight(0xffffff, .8)
    dirLight.position.set(3, 3, -3)
    dirLight.castShadow = true
    dirLight.shadow.radius = 3
    
    dirLight.shadow.camera.top = 2;
    dirLight.shadow.camera.bottom = -2;
    dirLight.shadow.camera.left = -2;
    dirLight.shadow.camera.right = 2;
    dirLight.shadow.camera.near = .02;
    dirLight.shadow.camera.far = 10;
    dirLight.shadow.bias = -0.005;
    dirLight.shadow.mapSize.set(1024, 1024)
    
    scene.add(dirLight)
    
    floorGeometry = new THREE.CircleGeometry(2, 80);
    floorMaterial = new THREE.MeshPhongMaterial({
        color: 0xdddddd,
        shininess: 20
    });
    
    floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI * 0.5;
    floor.position.z = 0;
    floor.position.x = 0;
    floor.position.y = 0;
    floor.receiveShadow = true;
    scene.add(floor);
    
    model = null
}
initialiseScene()
export default function viewer(canvasRef, gltfBuffer) {
    const renderer = new THREE.WebGLRenderer({
        canvas: canvasRef,
        antialias: true,
    });
    
    // renderer.setSize(canvasRef.clientWidth, canvasRef.clientWidth, false);

    renderer.shadowMap.enabled = true;
    
    var camera = new THREE.PerspectiveCamera(55, canvasRef.clientWidth / canvasRef.clientHeight, 0.1, 1000 );
    camera.position.set(-1, 1, -2);

    new ResizeObserver(() => {
        renderer.setSize(canvasRef.clientWidth, canvasRef.clientHeight, false);
        camera.aspect = canvasRef.clientWidth / canvasRef.clientHeight;
        camera.updateProjectionMatrix();
    }).observe(canvasRef)

    const controls = new OrbitControls(camera, canvasRef)
    // controls.autoRotate = true
    // controls.autoRotateSpeed = 3
    controls.target = new THREE.Vector3(0, 1, 0);
    controls.enableDamping = true
    controls.dampingFactor = .3
    controls.enablePan = false;
    controls.minDistance = .5;
    controls.maxDistance = 15;
    
    var mixer = undefined
    
    const clock = new THREE.Clock()
    clock.start();
    
    const gltfLoader = new GLTFLoader()

    function onLoadScene(gltf) {
        // dispose()
        if (model) {
            model.traverse(function(node) {
                if (node.geometry) {
                    node.geometry.dispose()
                }
                if (node.material) {
                    node.material.dispose()
                    if (node.material.map) {
                        node.material.map.dispose()
                    }
                }
            });
        }
        model = gltf.scene;
        
        gltf.scene.traverse(function(node) {
            if (node.isMesh) {
                node.receiveShadow = true;
                node.castShadow = true;
            }
        });
        
        if (gltf.animations.length > 0) {
            mixer = new THREE.AnimationMixer(gltf.scene)
            mixer.clipAction(gltf.animations[0]).play()
        }
        
        scene.add(gltf.scene)
        // controls.target = new THREE.Box3().setFromObject(gltf.scene).getCenter(new THREE.Vector3())
        controls.target = new THREE.Vector3(0, .8, 0);
    }

    const setModelFromBlob = (blob) => {
        scene.remove(model)
        gltfLoader.parse(blob, '/', (gltf) => {
            onLoadScene(gltf); });
    }
    
    const dispose = () => {
        return;

        renderer.dispose()
        dirLight.shadow.dispose()
        floor.geometry.dispose()
        floorMaterial.dispose()
        scene.remove(model)
        scene.traverse(function(node) {
            if (node.isMesh) {
                node.geometry.dispose()
                node.material.dispose()
            }
        })
    }
    
    function update() {
        if (!scene)
            return;
        const delta = clock.getDelta();
        renderer.render(scene, camera)
        
        controls.update(delta)
        
        if (mixer)
            mixer.update(delta)
        
        requestAnimationFrame(update);
    }
    update();
    
    return {
        setModelFromBlob,
        dispose
    }
}