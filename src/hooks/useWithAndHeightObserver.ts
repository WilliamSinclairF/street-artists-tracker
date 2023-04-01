import { useEffect, useMemo, useState } from 'react';

export function useWithAndHeightObserver(ref: React.RefObject<HTMLElement>) {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const resizeObserver = useMemo(
    () =>
      new ResizeObserver(() => {
        if (ref?.current?.offsetWidth !== width) {
          setWidth(ref?.current?.offsetWidth || 0);
        }
        if (ref?.current?.offsetHeight !== height) {
          setHeight(ref?.current?.offsetHeight || 0);
        }
      }),
    [height, ref, width]
  );

  useEffect(() => {
    if (!ref?.current) {
      return;
    }

    resizeObserver.observe(ref.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [ref, resizeObserver]);

  return { width, height };
}
