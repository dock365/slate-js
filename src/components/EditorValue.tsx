import * as React from 'react';
import { ClassNames } from '@emotion/core';
import { Value } from 'slate'

export default React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { className?: string; value: Value }>(
  ({ className, value, ...props }, ref: React.Ref<HTMLDivElement>) => {
    const textLines = value.document.nodes
      .map(node => node && node.text)
      .toArray()
      .join('\n')
    return (
      <ClassNames>
        {({ css, cx }) => (
          <div
            ref={ref}
            {...props}
            className={cx(
              className,
              css`
            margin: 30px -20px 0;
          `
            )}
          >
            <div
              className={css`
            font-size: 14px;
            padding: 5px 20px;
            color: #404040;
            border-top: 2px solid #eeeeee;
            background: #f8f8f8;
          `}
            >
              Slate's value as text
        </div>
            <div
              className={css`
            color: #404040;
            font: 12px monospace;
            white-space: pre-wrap;
            padding: 10px 20px;
            div {
              margin: 0 0 0.5em;
            }
          `}
            >
              {textLines}
            </div>
          </div>
        )}
      </ClassNames>
    )
  }
)