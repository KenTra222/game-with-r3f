import './style.css'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import { KeyboardControls } from '@react-three/drei'
import Experience from './Experience.jsx'
import Interface from './Interface'

const root = ReactDOM.createRoot(document.querySelector('#root'))

root.render(
    // keyboard controls
    <KeyboardControls map={ [
        {name: 'forward', keys: ['ArrowUp', 'KeyW']},
        {name: 'backward', keys: ['ArrowDown', 'KeyS']},
        {name: 'leftward', keys: ['ArrowLeft', 'KeyA']},
        {name: 'rightward', keys: ['ArrowRight', 'KeyD']},
        {name: 'jump', keys: ['Space']}



    ] }>

    <Canvas
        shadows
        camera={ {
            fov: 55,
            near: 0.1,
            far: 200,
            position: [ 2.5, 4, 6 ]
        } }
        >
        <Experience />
    </Canvas>
    <Interface/>
        </KeyboardControls>
)