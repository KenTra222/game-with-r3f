import * as THREE from 'three'
import {useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody, CuboidCollider } from '@react-three/rapier'
import { useGLTF } from '@react-three/drei'

THREE.ColorManagement.legacyMode = false

//geometry
const boxGeometry = new THREE.BoxGeometry(1,1,1)

const floorMaterial = new THREE.MeshStandardMaterial({ color: "limegreen"})
const floor2Material = new THREE.MeshStandardMaterial({ color: "greenyellow"})
const obstacleMaterial = new THREE.MeshStandardMaterial({ color: "orangered"})
const wallMaterial = new THREE.MeshStandardMaterial({ color: "slategrey"})


// floor
export const BlockStart = ({ position = [ 0, 0, 0 ]}) =>
{

    return <group position={ position }>
     <mesh 
     geometry={boxGeometry} 
     material={floorMaterial}
     position={[0,-0.1, 0]} 
     scale={[ 4,0.2,4]}
      receiveShadow/>           
    </group>
}

export   function BlockSpinner({ position = [ 0, 0, 0 ] })
{
  const obstacle = useRef()
  const [speed] = useState(() => (Math.random() + 0.2) * (Math.random() < 0.5 ? -1 : 1 ))
  

  useFrame((state) =>
    {
      // gets the time
        const time = state.clock.getElapsedTime()
      // creates a quaternion so that it spins
        const rotation = new THREE.Quaternion()
        //creates a euler
        rotation.setFromEuler(new THREE.Euler(0, time * speed, 0))
      // attaches it to the obstacle
      obstacle.current.setNextKinematicRotation(rotation)

    })

    return <group position={ position }>
      {/* floor */}
        <mesh geometry={ boxGeometry } material={ floor2Material } position={ [ 0, - 0.1, 0 ] } scale={ [ 4, 0.2, 4 ] } receiveShadow />
        
        {/*  twister obstacle */}
        <RigidBody 
          ref={ obstacle } 
          type="kinematicPosition" 
          position={[0, 0.3, 0]} 
          restitution={ 0.2 } 
          friction={ 0 }>

         <mesh geometry={ boxGeometry } material={ obstacleMaterial } scale={ [ 3.5, 0.3, 0.3 ] } castShadow receiveShadow />
        </RigidBody>
    </group>
}

//limbo animation
export function BlockLimbo({ position = [ 0, 0, 0 ] })
{
  const obstacle = useRef()
  //offsets the obstacel
  const [ timeOffset ] = useState(() => Math.random() * Math.PI * 2)
  

  useFrame((state) =>
    {
      // gets the time
        const time = state.clock.getElapsedTime()
        //makes obstacle go up and down
        const y = Math.sin(time * timeOffset) + 1.4
        obstacle.current.setNextKinematicTranslation({ x:position[0], y: position[1] + y , z: position[2]})

    })

    return <group position={ position }>
      {/* floor */}
        <mesh geometry={ boxGeometry } material={ floor2Material } position={ [ 0, - 0.1, 0 ] } scale={ [ 4, 0.2, 4 ] } receiveShadow />
        
        {/*  twister obstacle */}
        <RigidBody 
          ref={ obstacle } 
          //adds custom physic type for useframe
          type="kinematicPosition" 
          position={[0, 0.3, 0]} 
          restitution={ 0.2 } 
          friction={ 0 }>

         <mesh geometry={ boxGeometry } material={ obstacleMaterial } scale={ [ 3.5, 0.3, 0.3 ] } castShadow receiveShadow />
        </RigidBody>
    </group>
}

//axe animation
export function BlockAxe({ position = [ 0, 0, 0 ] })
{
  const obstacle = useRef()
  //offsets the obstacel
  const [ timeOffset ] = useState(() => Math.random() * Math.PI * 2)
  

  useFrame((state) =>
    {
      // gets the time
        const time = state.clock.getElapsedTime()
        //makes obstacle side to side
        const x = Math.sin(time * timeOffset) * 1.25
        obstacle.current.setNextKinematicTranslation({ x:position[0] + x, y: position[1]  + 0.75, z: position[2]})

    })

    return <group position={ position }>
      {/* floor */}
        <mesh geometry={ boxGeometry } material={ floor2Material } position={ [ 0, - 0.1, 0 ] } scale={ [ 4, 0.2, 4 ] } receiveShadow />
        
        {/*  twister obstacle */}
        <RigidBody 
          ref={ obstacle } 
          //adds custom physic type for useframe
          type="kinematicPosition" 
          position={[0, 0.3, 0]} 
          restitution={ 0.2 } 
          friction={ 0 }>

    <mesh geometry={ boxGeometry } material={ obstacleMaterial } scale={ [ 1.5, 1.5, 0.3 ] } castShadow receiveShadow />
    </RigidBody>
    </group>
}

export const BlockEnd = ({ position = [ 0, 0, 0 ]}) =>
{
  //imports model
  const hamburger = useGLTF('./hamburger.glb')

  //casts a shadow
  hamburger.scene.children.forEach((mesh)=>{
    mesh.castShadow=true
  })

    return <group position={ position }>
     <mesh geometry={ boxGeometry } material={ floorMaterial } position={ [ 0, 0, 0 ] } scale={ [ 4, 0.2, 4 ] } receiveShadow />    
    
    {/* goal */}
     <RigidBody type="fixed" colliders='hull' position={[ 0, 0.2, 0]} restitution={ 0.2 } friction={ 0 }> 
      <primitive object={hamburger.scene} scale={0.25}/>     
     </RigidBody>
    </group>
}

//Bounds

 function Bounds({ length=1}){
  return<>

<RigidBody type="fixed" restitution={ 0.2 } friction={ 0 }>

  {/* right wall */}
    <mesh
      position={ [ 2.15, .75, - (length * 2) + 2 ] }
       geometry={boxGeometry} 
       scale={[0.3, 1.5, 4 *length]}
       castShadow/>

  {/* left wall */}
<mesh
      position={ [ -2.15, .75, - (length * 2) + 2 ] }
      geometry={boxGeometry} 
       scale={[0.3, 1.5, 4 *length]}
       receiveShadow
       />

<mesh
            position={ [ 0, 0.75, - (length * 4) + 2] }
            geometry={ boxGeometry }
            material={ wallMaterial }
            scale={ [ 4, 1.5, 0.3 ] }
            receiveShadow
        />
        {/* floor bounds */}
         <CuboidCollider 
          // mathches the floor
          args={ [ 2, 0.1, 2 * length ] } 
          position={ [ 0, -0.1, - (length * 2) + 2 ] }/>
            </RigidBody>
  </>
}



export function  Level({count = 5, types=[BlockAxe,BlockLimbo,BlockSpinner]}) {


  // return a blocks array and set the dependencies to count and types
  const blocks = useMemo(()=>{
    const blocks = []

    //loops through the types
    for(let i = 0; i< count; i++){
      //makes the types random
      const type = types[Math.floor(Math.random() * types.length)]
      //pushes results to the type
       blocks.push(type)
    }

    return blocks
  }, [count, types])

  return (
<>
       {/* level */}
        <BlockStart position={ [ 0, 0, 0 ] } />
        {/* maps out the traps */}
        {blocks.map((Block, index) => <Block key={index} position={[ 0, 0, -( index + 1)*4]}/>)}
        <BlockEnd position={[0,0, - (count +1) * 4]}/>
        
        <Bounds length={count+2}/>
</>

  )
}

