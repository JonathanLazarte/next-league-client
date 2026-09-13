import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useUserInterface } from '@/hooks/useUserInterface';
import type { Section } from '@/redux/slices/userInterfaceSlice'

export const useRouteSync = () => {
  const pathname = usePathname();
  const { changeSection } = useUserInterface();

  useEffect(() => {
    const section = pathname.split("/").pop();
    if(!section) return

    changeSection(section);

  }, [pathname, changeSection]);
};
