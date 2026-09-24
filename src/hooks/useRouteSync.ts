import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useUserInterface } from '@/hooks/useUserInterface';
import type { Section } from '@/types/ui'

export const useRouteSync = () => {
  const pathname = usePathname();
  const { changeSection } = useUserInterface();

  useEffect(() => {
    const section = pathname.split("/").pop() as Section;
    if(!section) return

    changeSection(section);

  }, [pathname, changeSection]);
};
