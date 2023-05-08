import * as THREE from 'three'
import {useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'

THREE.ColorManagement.legacyMode = false

//geometry
const boxGeometry = new THREE.BoxGeometry(1,1,1)

const floorMaterial = new THREE.MeshStandardMaterial({ color: "limegreen"})
const floor2Material = new THREE.MeshStandardMaterial({ color: "greenyellow"})
const obstacleMaterial = new THREE.MeshStandardMaterial({ color: "orangered"})
const wallMaterial = new THREE.MeshStandardMaterial({ color: "slategrey"})


// floor
const BlockStart = ({ position = [ 0, 0, 0 ]}) =>
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

function BlockSpinner({ position = [ 0, 0, 0 ] })
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
function BlockLimbo({ position = [ 0, 0, 0 ] })
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



export default function  Level() {
    

  return (
<>
       
        <RigidBody type='fixed'>

        <BlockStart position={[0,0,8]} />
        <BlockSpinner position={[0,0,4]} />
        <BlockLimbo/>
        </RigidBody>

</>

  )
}

