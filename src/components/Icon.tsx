import * as React from 'react';
import { ClassNames } from '@emotion/core';
import { Icon } from "office-ui-fabric-react/lib/Icon";;
export default React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement> & { className?: string, iconName?: string }>(({ className, iconName, ...props }, ref: React.Ref<HTMLSpanElement>) => (
  <ClassNames>
    {({ css, cx }) => (
      <span
        {...props}
        ref={ref}
        className={cx(
          className,
          css`
            font-size: 18px;
            vertical-align: text-bottom;
          `
        )}
      >
        <Icon iconName={iconName} />
      </span>
    )}
  </ClassNames>
))