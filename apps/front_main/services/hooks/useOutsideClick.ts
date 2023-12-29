'use client';

import { MutableRefObject, useEffect } from 'react';

export const useOutsideClick = (
  ref: MutableRefObject<HTMLDivElement>,
  callback: { (): void; (): void; (): void; (): void }
) => {
  const handleClick = (e: any) => {
    if (ref.current && !ref.current.contains(e.target)) {
      callback();
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('click', handleClick);

      return () => {
        window.removeEventListener('click', handleClick);
      };
    }
  });
};
