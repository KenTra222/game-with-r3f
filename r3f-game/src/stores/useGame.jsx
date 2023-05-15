import {create} from 'zustand'

export default create((set) =>
{
    return {
        blocksCount: 3,

        // Phases
        phase: 'ready',

        start: () => 
        {
            console.log('starting')
            set(()=>
            {
                return {phase : 'playing'}
            })
        },

        reset: () => 
        {
            console.log('reset')
            set(()=>
            {
                return {phase : 'ready'}
            })
        },
        
        end: () => 
        {
            console.log('ended')
            set(()=>
            {
                return {phase : 'ended'}
            })
        },
    }
})