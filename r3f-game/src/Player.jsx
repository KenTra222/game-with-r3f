import {useRef, useEffect, useState} from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useKeyboardControls } from '@react-three/drei'
import { RigidBody, useRapier } from '@react-three/rapier'
import useGame from './stores/useGame'

const Player = () => {

  //initaial camera position
  const [smoothCameraPosition] = useState(()=> new THREE.Vector3(10, 10, 10))
  const [smoothCameraTarget] = useState(()=> new THREE.Vector3())

  const start = useGame((state) => state.start)
  const end = useGame((state)=>  state.end)
  const reset = useGame((state) => state.reset)
  const blocksCount = useGame((state) => state.blocksCount)

  //gets the keys state
  const [subscribeKeys, getKeys] = useKeyboardControls()

  //references the player
  const body = useRef()

  const { rapier, world } = useRapier()
  const rapierWorld = world.raw()


  //makes the player move in each direction
  useFrame((state, delta)=>{

    /* makes camera follow the player*/

    //controls
    const bodyPosition = body.current.translation()

    //positions camera behind the player
    const cameraPosition = new THREE.Vector3()
    cameraPosition.copy(bodyPosition)
    cameraPosition.z += 2.25
    cameraPosition.y += 0.65

    //makes camera look at the player
    const cameraTarget = new THREE.Vector3()
    cameraTarget.copy(bodyPosition)
    cameraTarget.y += 0.25

    smoothCameraPosition.lerp(cameraPosition, 5 * delta)
    smoothCameraTarget.lerp(cameraTarget, 5 * delta)


    //camera
    state.camera.position.copy(smoothCameraPosition)
    state.camera.lookAt(smoothCameraTarget)
 



  //direction keys
    const {forward, backward, leftward, rightward} = getKeys()

    //impulse and torque = position and rotation
    const impulse = { x: 0, y: 0, z: 0 }
    const torque = { x: 0, y: 0, z: 0 }

    const impulseStrength = 0.6 * delta
    const torqueStrength = 0.2 * delta

    if(forward){
      impulse.z -= impulseStrength
      torque.x -= torqueStrength
    }

    if(rightward){
      impulse.x += impulseStrength
      torque.z -= torqueStrength
    }

    if(leftward) {
      impulse.x -= impulseStrength
      torque.z += torqueStrength
    }

    if(backward){
      impulse.z += impulseStrength
      torque.x += torqueStrength
    }

    //attaches impulse and torque to the player
    body.current.applyImpulse(impulse)
    body.current.applyTorqueImpulse(torque)

    /**
     * phases
     */

    if (bodyPosition.z < -(blocksCount * 4 + 2) ){
      end()
    }

    if( bodyPosition.y < -4 ){
      reset()
    }

  })

  //jump function
  const jump = () =>
    {
        

        //keeps ball from jumping to infinity
        const origin = body.current.translation()
        origin.y -= 0.31
        const direction = { x: 0, y: -1, z: 0}
        
        //creates a ray caster
        const ray = new rapier.Ray(origin, direction)

        //log this to get the distance of the raycaster
        const hit = rapierWorld.castRay(ray, 10 , true)
       
        //toi = time of impact
       //sets the impulse based upon the time of impact 
        if(hit.toi < 0.15)
        {
        body.current.applyImpulse({x:0, y: 0.5, z: 0})

        }       
    }

    const restart = () =>{
      body.current.setTranslation({ x: 0, y : 1, z: 0})
      body.current.setLinvel({x:0, y:0, z:0})
      body.current.setAngvel({x:0, y: 0, z: 0})
    }

  //makes the player jump
  useEffect(()=>{

    const unsubscribeReset = useGame.subscribe(
      (state) => state.phase,
      (value) =>{
        if(value === 'ready'){
          restart()
        }
      },
    )

    //takes 2 functions 1st to return the state, 2nd to get the values
    const unsubscribeJump = subscribeKeys(
        (state) =>  state.jump,
        (value)=> 
        {
          if(value)
            jump()
        })

        const unsubscribeAny = subscribeKeys(()=>{
          start()
        })

        return () =>
        {
          unsubscribeJump()
          unsubscribeAny()
          unsubscribeReset()
        }
  }, [])


  return  <RigidBody 
            ref={body}
            colliders='ball' 
            position={[0, 1, 0]}
            restitution={0.2}
            friction={1}
            linearDamping={0.5}
            angularDamping={0.5}>

            <mesh castShadow>
                <icosahedronGeometry args={ [ 0.3, 1 ] } />
                <meshStandardMaterial flatShading color="mediumpurple" />
            </mesh>
          </RigidBody>
}

export default Player