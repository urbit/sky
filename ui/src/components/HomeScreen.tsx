//import { useState } from 'react'
import PathBar from './PathBar'
//import useWindowStore from '../state/useWindowStore.ts'

interface HomeScreenProps {
  id: number
}

export default function HomeScreen({ id }: HomeScreenProps) {
  return (
    <div className="p4 b1">
      <div className="hf wf fr ac jc b1">
        <div className="hf fc ac js">
          <div className="wf fr ac jc">
            <PathBar id={id} path={`~${window.ship}/home`} />
          </div>
          <div
            className="wf fr as js frw"
            style={{ width: '500px', flexWrap: 'wrap', marginTop: '8px' }}
          >
            Homescreen
          </div>
        </div>
      </div>
    </div>
  )
}
