import * as React from 'react';
import { ClassNames } from '@emotion/core';

export default React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { className?: string }>(({ className, ...props }, ref: React.Ref<HTMLDivElement>) => (
  <ClassNames>
    {({ css, cx }) => (
      <div
        {...props}
        ref={ref}
        className={cx(
          className,
          css`
        & > * {
          display: inline-block;
        }
        & > * + * {
          margin-left: 15px;
        }
      `
        )}
      />
    )}
  </ClassNames>
))
