import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import LoadingSpinner from "./LoadingSpinner"

function LoadingScreen({ children }) {
  const router = useRouter();
  const [ pageLoading, setPageLoading ] = useState(false);

  useEffect(() => {
    const handleStart = () => { 
      setPageLoading(true); 
    };

    const handleComplete = () => { 
      setPageLoading(false); 
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    }
  }, [router]);

  return (
    <>
     { pageLoading ? 
      <div className="z-40 h-screen w-screen fixed top-0 left-0 bg-white flex justify-center items-center">
        <LoadingSpinner/>
      </div>
     : children } 
    </>
  )
}

export default LoadingScreen 
