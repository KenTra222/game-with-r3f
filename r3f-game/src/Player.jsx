import React from 'react'

const Player = () => {
  return (
    <>
    <mesh castShadow>
        <icosahedronGeometry args={ [ 0.3, 1 ] } />
        <meshStandardMaterial flatShading color="mediumpurple" />
    </mesh></>
  )
}

export default Player