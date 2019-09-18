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
        white-space: pre-wrap;
        margin: 0 -20px 10px;
        padding: 10px 20px;
        font-size: 14px;
        background: #f8f8e8;
      `
        )}
      />
    )}
  </ClassNames>
))