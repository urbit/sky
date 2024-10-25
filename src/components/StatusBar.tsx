import '@urbit/sigil-js'
import bellIcon from '../assets/images/bell.png'
import closeIcon from '../assets/images/close.png'

const sigilConfig = {
  size: '30px',
  // TODO remove hard-coded ship
  point: '~sampel-palnet',
  // TODO get colors from tlon/landscape user preferences
  foreground: '#FFF',
  background: '#000',
  detail: 'none',
  space: 'default'
}

export default function StatusBar() {
  return (
    <div className='p2 fr ac jb'>
      <div className='br1 fr ac jb b1' style={{ height: '30px', paddingLeft: '10px', paddingRight: '10px', width: '200px' }}>
        <span>Workspace 1</span>
        <div>
          <img style={{ height: '10px', width: '10px' }} src={closeIcon} alt="Close space" />
        </div>
      </div>
      <div className='fr ac jb' style={{ height: '30px' }}>
        <div className='fr ac jc br1 b1' style={{ width: '30px', height: '30px' }}>
          <img src={bellIcon} alt="Open notifications" style={{ height: '20px' }} />
        </div>
        <urbit-sigil style={{ overflow: 'hidden', borderRadius: '3px', marginLeft: '5px' }} {...sigilConfig} />
      </div>
    </div>
  );
}
