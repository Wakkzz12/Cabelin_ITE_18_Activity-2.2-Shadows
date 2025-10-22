import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'lil-gui'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const material = new THREE.MeshStandardMaterial({ roughness: 0.4, metalness: 0.3, color: '#ffffff' })

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material)
sphere.position.y = 0.5
sphere.castShadow = true

const plane = new THREE.Mesh(new THREE.PlaneGeometry(8, 8), material)
plane.rotation.x = -Math.PI * 0.5
plane.receiveShadow = true

scene.add(sphere, plane)

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 0.3))

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4)
directionalLight.position.set(2, 2, -1)
directionalLight.castShadow = true
scene.add(directionalLight)

const spotLight = new THREE.SpotLight(0xffffff, 0.4, 10, Math.PI * 0.3)
spotLight.position.set(0, 2, 2)
spotLight.castShadow = true
scene.add(spotLight, spotLight.target)

const pointLight = new THREE.PointLight(0xffffff, 0.3)
pointLight.position.set(-1, 1, 0)
pointLight.castShadow = true
scene.add(pointLight)

const gui = new GUI({ width: 300 })
const lightsFolder = gui.addFolder('Shadow Lights')

const settings = {
  dirIntensity: directionalLight.intensity,
  spotIntensity: spotLight.intensity,
  pointIntensity: pointLight.intensity
}

lightsFolder.add(settings, 'dirIntensity', 0, 2, 0.01).name('Directional Light').onChange(v => directionalLight.intensity = v)
lightsFolder.add(settings, 'spotIntensity', 0, 2, 0.01).name('Spot Light').onChange(v => spotLight.intensity = v)
lightsFolder.add(settings, 'pointIntensity', 0, 2, 0.01).name('Point Light').onChange(v => pointLight.intensity = v)
lightsFolder.open()


// Camera
const sizes = { width: window.innerWidth, height: window.innerHeight }
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 2, 5)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setClearColor('#2a2a2a')

// Animation
const clock = new THREE.Clock()
function animate() {
  const elapsed = clock.getElapsedTime()
  sphere.position.x = Math.cos(elapsed) * 1.5
  sphere.position.z = Math.sin(elapsed) * 1.5
  sphere.position.y = Math.abs(Math.sin(elapsed * 3)) + 0.5
  controls.update()
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}
animate()

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width, sizes.height)
})
