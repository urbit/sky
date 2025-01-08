import React, { useEffect, RefObject } from 'react';

const WindowOverlay = ({ iframeRef } : { iframeRef: RefObject<HTMLIFrameElement | null>}) => {
  useEffect(() => {
    console.log('iframe ref', iframeRef)

    const handleKeyDown = (event: KeyboardEvent) => {
        console.log('keyboard event', event)
      const isCtrlOrCmd = event.ctrlKey || event.metaKey;

      if (isCtrlOrCmd) {
        return;
      }

      // If it's a normal key, forward it to the iframe
      if (iframeRef && iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          { type: 'keyboard-event', key: event.key, code: event.code },
          '*'
        );
      }
    };


    // const handleMouseEvent = (event: MouseEvent) => {
    //     console.log('HandleMouseEvent');
    //     //const overlay = document.getElementById('window-overlay');

    //     // if(overlay){
    //     //     if (!isMouseDown) {
    //     //     //overlay.style.pointerEvents = 'auto'
    //     //     }
    //     // }

    //     if (iframeRef.current && iframeRef.current.contentWindow) {
    //         console.log('sending post req to iframe')
    //         // Forward mouse event to iframe
    //         iframeRef.current.contentWindow.postMessage(
    //           {    
    //             type: 'mouse-event',
    //             clientX: event.clientX,
    //             clientY: event.clientY,
    //             button: event.button,
    //           },
    //           '*'
    //         );
    //       }
    //       if (iframeRef.current) {
    //         console.log('mouseevent focus');
    //         document.body.focus(); // This refocuses the parent document to capture keyboard events
    //       }
    // }

    const handleFocus = () => {

        // When the window is focused, we can ensure key events are captured
        if (iframeRef.current) {
            console.log('FOCUS')
          // Focus the iframe back to allow interaction, but keep global key events active
          iframeRef.current.contentWindow?.focus();
        }
      };

    const handleClick = () => {
        console.log('HandleClick');

        //isMouseDown = true;
        //const overlay = document.getElementById('window-overlay');
        const iframe = iframeRef.current;

        if(iframe){
            iframe.blur()
        }

    }

    const handleMouseUp = () =>{
        console.log('Mouse up');

        // const overlay = document.getElementById('window-overlay');

        // if(overlay){
        //     overlay.style.pointerEvents = 'auto'
        // }

    }
  
      // Attach the focus event listener to the window object
    //document.addEventListener('mousemove', handleMouseEvent);
    //window.addEventListener('click', handleClick);
    // window.addEventListener('focus', handleFocus);
    //window.addEventListener('keydown', handleKeyDown);
    //window.addEventListener('mousedown', handleClick);
    //window.addEventListener('mouseup', handleMouseUp);

    return () => {
    //document.removeEventListener('mousemove', handleMouseEvent);
    //window.removeEventListener('click', handleClick);
    //window.removeEventListener('keydown', handleKeyDown);
    //   window.removeEventListener('focus', handleFocus);
    //window.removeEventListener('mousedown', handleClick);
    //window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [iframeRef]);

  const handleMouseEvent = (event: React.MouseEvent<HTMLDivElement>) => {
    console.log('HandleMouseEvent');

    if (iframeRef.current && iframeRef.current.contentWindow) {
        console.log('sending post req to iframe', iframeRef.current)
        // Forward mouse event to iframe
        iframeRef.current.contentWindow.postMessage(
          {    
            type: 'mouse-event',
            clientX: event.clientX,
            clientY: event.clientY,
            button: event.button,
          },
          '*'
        );
      }
      if (iframeRef.current) {
        console.log('mouseevent focus');
        document.body.focus(); // This refocuses the parent document to capture keyboard events
      }
}


  return (
    // <p>hi</p>
      <div
      onMouseMove={(e:React.MouseEvent<HTMLDivElement>)=>{handleMouseEvent(e)}}
      onClick={handleMouseEvent}
      className='window-overlay'
      id='window-overlay'
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(255, 255, 255, 0)', // Transparent overlay
        zIndex: 4,
        pointerEvents: 'auto'
      }}
    />
  );
};

export default WindowOverlay;
