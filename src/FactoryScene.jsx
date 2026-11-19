import{useEffect,useRef}from'react';
import * as THREE from'three';
const mat=(color,metalness=0,roughness=.55)=>new THREE.MeshStandardMaterial({color,metalness,roughness});
function box(w,h,d,m,x,y,z,group){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;group.add(o);return o}
function cyl(r,h,m,x,y,z,group,segments=24){const o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,segments),m);o.position.set(x,y,z);o.castShadow=true;group.add(o);return o}
export default function FactoryScene({installed=[],selected='display',onSelect=()=>{},workerCount=1,stage=0}){const host=useRef(null),api=useRef(null),cb=useRef({onSelect,selected,installed,workerCount,stage});cb.current={onSelect,selected,installed,workerCount,stage};
useEffect(()=>{const el=host.current;if(!el)return;const scene=new THREE.Scene();scene.background=new THREE.Color('#101a25');scene.fog=new THREE.Fog('#101a25',18,36);
const camera=new THREE.PerspectiveCamera(38,1,.1,100);camera.position.set(8,8,11);camera.lookAt(0,1,0);
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;el.appendChild(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xbad7ff,0x26303b,2.1));const key=new THREE.DirectionalLight(0xffe3bd,3.2);key.position.set(5,10,6);key.castShadow=true;key.shadow.mapSize.set(1024,1024);scene.add(key);const fill=new THREE.PointLight(0x4b9dff,18,14);fill.position.set(-5,4,1);scene.add(fill);
const floor=box(24,.2,24,mat('#253342',.25,.85),0,-.15,0,scene);const grid=new THREE.GridHelper(24,24,'#6a849a','#344758');grid.position.y=-.04;scene.add(grid);
const wall=box(24,5,.25,mat('#1c2936'),0,2.4,-6,scene);const wall2=box(.25,5,12,mat('#1a2632'),-12,2.4,0,scene);
for(let i=0;i<5;i++){box(2.1,.08,.1,mat('#5c7184',.5),-8+i*4,4.5,-5.82,scene);box(2,.035,.04,mat(i%2?'#55c6ff':'#79e0bc',.2),-8+i*4,4.42,-5.75,scene)}
// industrial workbench
box(5,.32,2.5,mat('#364655',.55),0,1,0,scene);box(5.15,.12,2.65,mat('#7c8993',.65,.3),0,1.22,0,scene);
for(const x of [-2,2])for(const z of [-.9,.9])box(.16,1,.16,mat('#202c37',.7),x,.48,z,scene);
box(2.3,.12,1.6,mat('#101a25'),0,1.36,-.05,scene);
// smartphone chassis and board
const phone=new THREE.Group();phone.position.set(0,1.48,0);phone.rotation.x=-Math.PI/2;scene.add(phone);
const frame=new THREE.Mesh(new THREE.BoxGeometry(1.45,.04,2.75),mat('#71889c',.85,.23));frame.castShadow=true;phone.add(frame);
const inner=box(1.31,.035,2.6,mat('#172b2b',.25),0,.04,0,phone);
const copper=mat('#bd874c',.7,.3),black=mat('#080f18',.4,.25),silver=mat('#b8c6d2',.8,.22),blue=mat('#4a9ee8',.45,.25),green=mat('#36a982',.4,.3);
const components={display:box(1.27,.035,2.52,mat('#172c48',.55,.18),0,.09,0,phone),chip:box(.43,.12,.43,black,-.2,.16,-.2,phone),ram:box(.5,.08,.2,green,.38,.13,.3,phone),battery:box(.82,.09,1.05,mat('#52677a',.35),.15,.13,.9,phone),camera: new THREE.Group()};
components.camera.position.set(-.43,.13,-.95);phone.add(components.camera);for(let i=0;i<3;i++){cyl(.12,.08,black,0,0,i*.28,components.camera,20);cyl(.075,.085,blue,0,.05,i*.28,components.camera,20)}
box(.32,.06,.32,copper,-.55,.12,.48,phone);box(.18,.07,.4,silver,.55,.12,-.65,phone);
// component positions hidden initially except chassis
const partObjects={display:components.display,chip:components.chip,ram:components.ram,battery:components.battery,camera:components.camera};
Object.entries(partObjects).forEach(([id,o])=>{o.userData.partId=id});
const tableLight=new THREE.PointLight(0x69bfff,25,5);tableLight.position.set(0,3,0);scene.add(tableLight);
// shelves, bins, factory props
for(let i=0;i<4;i++){box(1.1,.09,.7,mat('#4a5a68',.4),-5,1.2+i*.78,-2.6,scene);for(let j=0;j<3;j++){const b=box(.27,.28,.28,mat(['#4a91bf','#b9854e','#4a9b7e'][j]),-5.35+j*.34,1.38+i*.78,-2.6,scene);b.userData.partId=['display','chip','battery'][j]}}
for(let i=0;i<4;i++){box(.8,.45,.8,mat('#344653',.3),4+i*1.25,.25,2.8,scene);box(.82,.08,.82,mat('#718391',.6),4+i*1.25,.52,2.8,scene)}
// conveyor belt
box(5,.22,1.1,mat('#141e27',.65),4,1,0,scene);for(let i=0;i<13;i++){const roller=cyl(.09,1.12,mat('#8093a3',.8,.25),1.8+i*.36,1.12,0,scene,16);roller.rotation.z=Math.PI/2}
// robot arm
const robot=new THREE.Group();robot.position.set(2,1.35,-1.1);scene.add(robot);cyl(.35,.2,mat('#34495b',.8),0,0,0,robot);const arm1=box(.2,.95,.2,mat('#d6a64e',.65),0,.5,0,robot);arm1.rotation.z=-.38;const joint=cyl(.19,.25,mat('#354a5c',.8),-.18,1,0,robot);joint.rotation.z=Math.PI/2;const arm2=box(.16,.72,.16,mat('#e2b85e',.7),-.42,1.25,0,robot);arm2.rotation.z=.6;
for(let i=0;i<Math.max(1,Math.min(workerCount,4));i++){const worker=new THREE.Group();worker.position.set(-3.3+i*.72,1.36,1.55);scene.add(worker);const skin=mat('#d4a47d'),uniform=mat(i%2?'#426b86':'#2e6070'),pants=mat('#263746');cyl(.23,.12,mat('#263a48'),0,0,0,worker);const torso=box(.34,.55,.22,uniform,0,.4,0,worker);cyl(.14,.22,skin,0,.79,0,worker);const head=new THREE.Mesh(new THREE.SphereGeometry(.18,16,12),skin);head.position.set(0,.98,0);head.castShadow=true;worker.add(head);box(.38,.08,.25,mat('#1d2d3b'),0,1.11,0,worker);for(const s of [-1,1]){const arm=box(.11,.48,.12,uniform,s*.25,.42,0,worker);arm.rotation.z=s*.22;const hand=cyl(.065,.12,skin,s*.28,.17,0,worker);hand.rotation.z=Math.PI/2;const leg=box(.13,.45,.14,pants,s*.1,-.1,0,worker);leg.rotation.z=s*.04}}
const hitTargets=[...Object.values(partObjects),...scene.children.filter(o=>o.userData?.partId)];const ray=new THREE.Raycaster(),pointer=new THREE.Vector2();let down=null,dragging=false,theta=.62,phi=.98,radius=15,raf=0;const updateCamera=()=>{camera.position.set(Math.sin(theta)*radius*Math.sin(phi),Math.cos(phi)*radius,Math.cos(theta)*radius*Math.sin(phi));camera.lookAt(0,1,0)};
const pointerDown=e=>{down={x:e.clientX,y:e.clientY,theta,phi};dragging=false};const pointerMove=e=>{if(!down)return;const dx=e.clientX-down.x,dy=e.clientY-down.y;if(Math.abs(dx)+Math.abs(dy)>5)dragging=true;if(dragging){theta=down.theta-dx*.006;phi=THREE.MathUtils.clamp(down.phi+dy*.005,.45,1.35);updateCamera()}};const pointerUp=e=>{if(!down)return;if(!dragging){const rect=renderer.domElement.getBoundingClientRect();pointer.x=((e.clientX-rect.left)/rect.width)*2-1;pointer.y=-((e.clientY-rect.top)/rect.height)*2+1;ray.setFromCamera(pointer,camera);const hits=ray.intersectObjects(scene.children,true);const hit=hits.find(h=>h.object.userData.partId);if(hit)cb.current.onSelect(hit.object.userData.partId)}down=null};
renderer.domElement.addEventListener('pointerdown',pointerDown);window.addEventListener('pointermove',pointerMove);window.addEventListener('pointerup',pointerUp);
const resize=()=>{const w=el.clientWidth,h=el.clientHeight;if(!w||!h)return;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false)};const ro=new ResizeObserver(resize);ro.observe(el);resize();updateCamera();
const clock=new THREE.Clock();const animate=()=>{raf=requestAnimationFrame(animate);const t=clock.getElapsedTime();robot.rotation.y=Math.sin(t*.7)*.16;arm1.rotation.z=-.38+Math.sin(t*1.8)*.16;arm2.rotation.z=.6+Math.sin(t*1.8+.7)*.2;robot.position.y=1.35+Math.sin(t*2)*.025;scene.traverse(o=>{if(o.userData.partId&&o.material?.emissive){const active=o.userData.partId===cb.current.selected;o.material.emissive.set(active?'#1a4770':'#000000');o.material.emissiveIntensity=active?.6:0}});renderer.render(scene,camera)};animate();
api.current={scene,phone,components,renderer};return()=>{cancelAnimationFrame(raf);ro.disconnect();renderer.domElement.removeEventListener('pointerdown',pointerDown);window.removeEventListener('pointermove',pointerMove);window.removeEventListener('pointerup',pointerUp);renderer.dispose();el.removeChild(renderer.domElement);scene.traverse(o=>{o.geometry?.dispose();if(o.material){if(Array.isArray(o.material))o.material.forEach(m=>m.dispose());else o.material.dispose()}});api.current=null}},[]);
useEffect(()=>{const a=api.current;if(!a)return;const {components}=a;Object.entries(components).forEach(([id,o])=>{if(id==='camera'){o.visible=installed.includes(id);return}o.visible=id==='display'||installed.includes(id)});},[installed]);
return <div className="factory-canvas" ref={host} aria-label="Interactive 3D smartphone factory. Drag to orbit and tap parts to select."/>}
