import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { setPreviousPath, getPreviousPath } from '../utils/routing-history';

const useRouterOverride = () => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChangeStart = (url) => {
      setPreviousPath(router.asPath);
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
    };
  }, [router]);

  const customBack = async () => {
    const backPath = getPreviousPath();

    if (backPath.startsWith('/catalog/')) {
      await router.back();
    } else {
      await router.push('/');
    }
  };

  return {
    ...router,
    back: customBack,
  };
};

export default useRouterOverride;
