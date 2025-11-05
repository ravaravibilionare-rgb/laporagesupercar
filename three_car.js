// Build a stylized supercar using Three.js primitives
(function(){
  const container = document.getElementById('car-3d');
  if(!container) return;
  const w = container.clientWidth, h = container.clientHeight;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, w/h, 0.1, 1000);
  camera.position.set(0,2.2,6);

  const renderer = new THREE.WebGLRenderer({antialias:true,alpha:true});
  renderer.setSize(w,h);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff,1);
  light.position.set(5,10,7);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0x404040,0.9));

  // body
  const bodyMat = new THREE.MeshStandardMaterial({color:0xff1e1e,metalness:0.6,roughness:0.3});
  const body = new THREE.Mesh(new THREE.BoxGeometry(3.4,0.6,1.4), bodyMat);
  body.position.y = 0.5;
  body.scale.set(1,0.6,1);
  scene.add(body);

  // cabin
  const cabinMat = new THREE.MeshStandardMaterial({color:0x111827,metalness:0.2,roughness:0.1,transparent:true,opacity:0.95});
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.6,0.45,1.0), cabinMat);
  cabin.position.set(0.2,0.8,0);
  cabin.rotation.y = -0.03;
  scene.add(cabin);

  // nose (wedge)
  const noseGeom = new THREE.BoxGeometry(1.0,0.4,1.4);
  const nose = new THREE.Mesh(noseGeom, bodyMat);
  nose.position.set(-1.1,0.45,0);
  nose.scale.set(0.9,1,1);
  nose.rotation.z = -0.02;
  scene.add(nose);

  // wheels
  const wheelMat = new THREE.MeshStandardMaterial({color:0x111111,metalness:0.1,roughness:0.6});
  const tyre = new THREE.CylinderGeometry(0.35,0.35,0.5,24);
  function makeWheel(x,z){
    const wh = new THREE.Mesh(tyre,wheelMat);
    wh.rotation.z = Math.PI/2;
    wh.position.set(x,0.15,z);
    scene.add(wh);
  }
  makeWheel(1.1,0.9);
  makeWheel(1.1,-0.9);
  makeWheel(-1.1,0.9);
  makeWheel(-1.1,-0.9);

  // spoiler
  const spoiler = new THREE.Mesh(new THREE.BoxGeometry(0.9,0.06,0.18), bodyMat);
  spoiler.position.set(1.4,0.85,0);
  spoiler.rotation.y = 0.02;
  scene.add(spoiler);

  // simple ground reflection
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(20,20), new THREE.MeshStandardMaterial({color:0x071018,metalness:0.1,roughness:0.9}));
  ground.rotation.x = -Math.PI/2;
  ground.position.y = -0.05;
  scene.add(ground);

  // controls
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableZoom = true;
  controls.enablePan = false;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.5;

  function onResize(){
    const ww = container.clientWidth, hh = container.clientHeight;
    camera.aspect = ww/hh;
    camera.updateProjectionMatrix();
    renderer.setSize(ww,hh);
  }
  window.addEventListener('resize', onResize);

  // animation
  let t = 0;
  function animate(){
    requestAnimationFrame(animate);
    t += 0.01;
    body.rotation.y = Math.sin(t*0.4)*0.03;
    renderer.render(scene, camera);
  }
  animate();
})();
