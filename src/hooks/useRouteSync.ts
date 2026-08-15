import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useUserInterface } from '@/hooks/useUserInterface';

export const useRouteSync = () => {
  const pathname = usePathname();
  const { changeSection } = useUserInterface();

  useEffect(() => {
    const section = pathname.split("/").pop();
    changeSection(section);
  }, [pathname, changeSection]);
};
