import * as React from 'react';
import { RenderBlockProps } from 'slate-react';

export default class Video extends React.Component<RenderBlockProps, {}> {
  public render() {
    const { isSelected } = this.props

    return (
      <div {...this.props.attributes}>
        {this._renderVideo()}
      </div>
    )
  }

  private _renderVideo() {
    const { node, isFocused } = this.props;
    const src = node.data.get('src');
    const height = node.data.get('height');
    const width = node.data.get('width');

    const wrapperStyle: React.CSSProperties = {
      position: 'relative',
      outline: isFocused ? '2px solid blue' : 'none',
    };

    const maskStyle: React.CSSProperties = {
      display: isFocused ? 'none' : 'block',
      position: 'absolute',
      top: '0',
      left: '0',
      cursor: 'cell',
      zIndex: 1,
    };

    const iframeStyle = {
      display: 'block',
    };

    return (
      <div style={wrapperStyle}>
        <div style={maskStyle} />
        <iframe
          id="ytplayer"
          width={width}
          height={height}
          src={src}

          frameBorder="0"
          style={iframeStyle}
        />
      </div>
    )
  }

  private _onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video: string = e.target.value
    const { node, editor } = this.props
    editor.setNodeByKey(node.key, {
      type: node.key, data: {
        "src": "https://www.youtube.com/embed/iNk5Res9bB0",
        "height": "315",
        "width": "560",
      }
    })
  }

  private _onClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
    console.log("On Click");
    e.currentTarget.focus()

  }
}