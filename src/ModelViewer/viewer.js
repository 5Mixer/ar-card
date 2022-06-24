import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default function viewer(canvasRef) {

    const renderer = new THREE.WebGLRenderer({
        canvas: canvasRef,
        antialias: false,
    });
    renderer.setSize(500, 500);

    const scene = new THREE.Scene();

    const ambientLight = new THREE.AmbientLight(0xffffff, .5)
    scene.add(ambientLight)



    const light2 = new THREE.PointLight(0xffffff, 1)
    light2.position.set(30, 30, -30)
    
    scene.add(light2)


    const camera = new THREE.PerspectiveCamera(75, canvasRef.width / canvasRef.height, 0.1, 1000 );
    camera.position.set(-5, 8, -10)
    camera.lookAt(0,0,0)


    const controls = new OrbitControls(camera, canvasRef)
    // controls.enableDamping = true
    controls.target.set(0, 1, 0)

    // Create meshes, materials, etc.

    // const geometry = new THREE.BoxGeometry(1,1,1);
    // const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    // const cube = new THREE.Mesh(geometry, material);
    
    // scene.add(cube);

    function update() {
        renderer.render(scene, camera);

        requestAnimationFrame(update);
    }

    const gltfLoader = new GLTFLoader()

    gltfLoader.load(
    process.env.PUBLIC_URL + '/models/pig/pig.gltf',
    (gltf) => {
        gltf.scene.scale.set(7,7,7)

        // mixer = new THREE.AnimationMixer(gltf.scene)

        // const animationAction = mixer.clipAction((gltf as any).animations[0])
        // animationActions.push(animationAction)
        // animationsFolder.add(animations, 'default')
        // activeAction = animationActions[0]


        scene.add(gltf.scene)

    })



    update();

}