import { useState } from 'react'

export default function NavBar() {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className='fr ac jb b2'
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '30px',
        paddingLeft: '10px',
        paddingRight: '10px',
        opacity: hovered ? 1.0 : 0.0,
      }}
    >
      <p>~sampel/path</p>
      <div className='fr ac jb' style={{ width: '30px' }}>
        <p>_</p>
        <p>x</p>
      </div>
    </div>
  )
}
