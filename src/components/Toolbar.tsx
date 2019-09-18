import * as React from 'react';
import Menu from './Menu';
import { ClassNames } from "@emotion/core";

export default React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { className?: string; }>(({ className, ...props }, ref: React.Ref<HTMLDivElement>) => (
  <ClassNames>
    {({ css, cx }) => (
      <Menu
        {...props}
        ref={ref}
        className={cx(
          className,
          css`
            position: relative;
            padding: 10px;
            border-bottom: 2px solid #eee;
            margin-bottom: 10px;
          `
        )}
      />
    )}
  </ClassNames>
))