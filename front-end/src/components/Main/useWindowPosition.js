import { useLayoutEffect, useState } from 'react';

export default function useWindowPosition(id) {
  const [animation, setAnimation] = useState(false);

  useLayoutEffect(() => {
    
    function updatePosition() {
      // Returns the height of the id element. In this case, it would be the login/register element on load.
      const offetSetHeight = window.document.getElementById(id).offsetHeight;
      // If the Scroll down height is greater than 70%, the animation starts 
      console.log(window.pageYOffset)
      if (window.pageYOffset > offetSetHeight * 0.7) {
        setAnimation(true);
      }
      else
      setAnimation(false);
    }
    // Animation starts on scroll of mouse 
    window.addEventListener('scroll', updatePosition);
    updatePosition();
    return () => window.removeEventListener('scroll', updatePosition);
  }, [id]);
  
  return animation;
}