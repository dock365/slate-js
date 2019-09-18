import * as React from 'react';
import { ClassNames } from '@emotion/core';

export default React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement> & { className?: string; active?: boolean; reversed?: boolean; }>(
  ({ className, active, reversed, ...props }, ref) => (
    <ClassNames>
      {({ css, cx }) => (
        <span
          {...props}
          ref={ref}
          className={cx(
            className,
            css`
          cursor: pointer;
          color: ${reversed
                ? active ? 'white' : '#aaa'
                : active ? 'black' : '#ccc'};
        `
          )}
        />
      )}
    </ClassNames>
  )
)