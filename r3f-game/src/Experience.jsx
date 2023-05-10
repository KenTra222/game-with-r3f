import { OrbitControls } from '@react-three/drei'
import Lights from './Lights.jsx'
import {Level} from './Level.jsx'
import {Physics, Debug} from '@react-three/rapier'
import Player from './Player.jsx'
import useGame from './stores/useGame.jsx'

export default function Experience()

{
    return <>

        {/* <OrbitControls makeDefault /> */}

        <Physics >
             
            <Lights />
            <Player/>
            <Level/>
        </Physics>

    </>
}