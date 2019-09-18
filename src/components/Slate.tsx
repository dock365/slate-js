import { Editor, RenderBlockProps, RenderMarkProps, EventHook } from 'slate-react'
import { Value, Point } from 'slate'
import Html from 'slate-html-serializer';
import { initializeIcons } from '@uifabric/icons';

import React from 'react'
// import initialValue from './value.json'
import { isKeyHotkey } from 'is-hotkey'
import Toolbar from './Toolbar'
import Button from './Button'
import Icon from './Icon'
import schema from './schema';
import Video from './Video';
import ImageInsertButton from './ImageInsertButton';
import VideoInsertButton from './VideoInsertButton';
// import { css, jsx } from '@emotion/core';
// import { Icon } from 'office-ui-fabric-react/lib/Icon';

const DEFAULT_NODE = 'paragraph'

const isBoldHotkey = isKeyHotkey('mod+b')
const isItalicHotkey = isKeyHotkey('mod+i')
const isUnderlinedHotkey = isKeyHotkey('mod+u')
const isCodeHotkey = isKeyHotkey('mod+`')

initializeIcons();

export interface IProps {

}

export interface IState {
  value: Value;
}

const html = new Html();

class RichTextExample extends React.Component<IProps, IState> {
  private editorRef: React.RefObject<Editor>
  constructor(props: IProps) {
    super(props);

    this.state = {
      value: html.deserialize("<h3>Hello World</h3>"),
    };

    this.editorRef = React.createRef()

  }


  private hasMark = (type: string) => {
    const { value } = this.state
    return value.activeMarks.some(mark => mark ? (mark.type === type) : false)
  }

  private hasBlock = (type: string) => {
    const { value } = this.state
    return value.blocks.some(node => node ? node.type === type : false)
  }

  render() {
    return (
      <div
        style={{ border: "solid thin #ccc" }}
      >
        <Toolbar>
          {this.renderMarkButton('bold', 'Bold')}
          {this.renderMarkButton('italic', 'Italic')}
          {this.renderMarkButton('underlined', 'Underline')}
          {this.renderMarkButton('code', 'Code')}
          {this._renderBlockButton('heading-one', 'Header1')}
          {this._renderBlockButton('heading-two', 'Header2')}
          {this._renderBlockButton('block-quote', 'RightDoubleQuote')}
          {this._renderBlockButton('numbered-list', 'NumberedList')}
          {this._renderBlockButton('bulleted-list', 'BulletedList')}
          <ImageInsertButton editor={this.editorRef.current} />
          <VideoInsertButton editor={this.editorRef.current} />
        </Toolbar>
        <Editor
          spellCheck
          autoFocus
          schema={schema}
          placeholder="Enter some rich text..."
          ref={this.editorRef}
          value={this.state.value}
          onChange={this._onChange}
          onKeyDown={this._onKeyDown}
          renderBlock={this._renderBlock}
          renderMark={this._renderMark}
          onBlur={this._onBlur}
          style={{
            padding: "10px",
          }}
        />
      </div>
    )
  }

  renderMarkButton = (type: string, icon: string) => {
    const isActive = this.hasMark(type)

    return (
      <Button
        active={isActive}
        onMouseDown={event => this.onClickMark(event, type)}
      >
        <Icon iconName={icon} />
      </Button>
    )
  }

  _renderBlockButton = (type: string, icon: string) => {
    let isActive = this.hasBlock(type)

    if (['numbered-list', 'bulleted-list'].includes(type)) {
      const { value: { document, blocks } } = this.state

      if (blocks.size > 0) {
        const parent: any = document.getParent(blocks.first().key)
        isActive = this.hasBlock('list-item') && parent && parent.type === type ? true : false;
      }
    }

    return (
      <Button
        active={isActive}
        onMouseDown={event => this.onClickBlock(event, type)}
      >
        <Icon iconName={icon} />
      </Button>
    )
  }

  _renderImageBlockButton = (icon: string) => {
    return (
      <Button onMouseDown={this._onClickImageBlock} >
        <Icon iconName={icon} />
      </Button>
    )
  }

  _renderMediaBlockButton = (icon: string) => {
    return (
      <Button onMouseDown={this._onClickMediaBlock} >
        <Icon iconName={icon} />
      </Button>
    )
  }

  _renderBlock = (props: RenderBlockProps, editor: any, next: () => any) => {
    const { attributes, children, node } = props

    switch (node.type) {
      case 'block-quote':
        return <blockquote {...attributes}>{children}</blockquote>
      case 'bulleted-list':
        return <ul {...attributes}>{children}</ul>
      case 'heading-one':
        return <h1 {...attributes}>{children}</h1>
      case 'heading-two':
        return <h2 {...attributes}>{children}</h2>
      case 'list-item':
        return <li {...attributes}>{children}</li>
      case 'numbered-list':
        return <ol {...attributes}>{children}</ol>
      case 'empty-paragraph':
        return <p {...attributes} >{children}</p>
      case "image":
        return (
          <img
            {...attributes}
            src={node.data.get("src")}
            alt={node.data.get("alt")}
            style={{ height: node.data.get("height"), width: node.data.get("width") }}
          />
        );
      case "media":
        return <Video {...props} />

      default:
        return next()
    }
  }

  _renderMark = (props: RenderMarkProps, editor: any, next: () => any) => {
    const { children, mark, attributes } = props

    switch (mark.type) {
      case 'bold':
        return <strong {...attributes}>{children}</strong>
      case 'code':
        return <code {...attributes}>{children}</code>
      case 'italic':
        return <em {...attributes}>{children}</em>
      case 'underlined':
        return <u {...attributes}>{children}</u>
      default:
        return next()
    }
  }

  private _onChange = ({ value }: { value: Value }) => {
    this.setState({ value })
  }

  private _onBlur: EventHook = (event: Event, editor: any, next: () => any) => {
    /* const _editor: Editor = editor; */

    // debugger;
    // const serialized = html.serialize(_editor.value);

  }

  private _onKeyDown = (event: any, editor: any, next: () => any) => {
    let mark

    if (isBoldHotkey(event)) {
      mark = 'bold'
    } else if (isItalicHotkey(event)) {
      mark = 'italic'
    } else if (isUnderlinedHotkey(event)) {
      mark = 'underlined'
    } else if (isCodeHotkey(event)) {
      mark = 'code'
    } else {
      return next()
    }

    event.preventDefault()
    editor.toggleMark(mark)
  }

  onClickMark = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>, type: string) => {
    event.preventDefault()
    if (this.editorRef && this.editorRef.current)
      this.editorRef.current.toggleMark(type)
  }

  onClickBlock = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>, type: string) => {
    event.preventDefault()


    if (this.editorRef && this.editorRef.current) {
      const editor = this.editorRef.current
      const { value } = editor;
      const { document } = value

      // Handle everything but list buttons.
      if (type !== 'bulleted-list' && type !== 'numbered-list') {
        const isActive = this.hasBlock(type)
        const isList = this.hasBlock('list-item')

        if (isList) {
          editor
            .setBlocks(isActive ? DEFAULT_NODE : type)
            .unwrapBlock('bulleted-list')
            .unwrapBlock('numbered-list')
        } else {
          editor.setBlocks(isActive ? DEFAULT_NODE : type)
        }
      } else {
        // Handle the extra wrapping required for list buttons.
        const isList = this.hasBlock('list-item')
        const isType = value.blocks.some(block => {
          if (!block) return false;
          return !!document.getClosest(block.key, (parent: any) => parent.type === type)
        })

        if (isList && isType) {
          editor
            .setBlocks(DEFAULT_NODE)
            .unwrapBlock('bulleted-list')
            .unwrapBlock('numbered-list')
        } else if (isList) {
          editor
            .unwrapBlock(
              type === 'bulleted-list' ? 'numbered-list' : 'bulleted-list'
            )
            .wrapBlock(type)
        } else {
          editor.setBlocks('list-item').wrapBlock(type)
        }
      }
    }
  }

  private _onClickImageBlock = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    const editor = this.editorRef.current
    if (editor) {
      const data = {
        "src": "https://cdn.pixabay.com/photo/2019/09/01/18/02/couple-4445670_960_720.jpg",
        "height": "720",
        "width": "960",
        "alt": "image alt"
      };
      editor.command(this._insertBlock, "image", data);
    }
  }


  private _onClickMediaBlock = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    const editor = this.editorRef.current
    if (editor) {
      const data = {
        "src": "https://www.youtube.com/embed/iNk5Res9bB0",
        "height": "315",
        "width": "560",
        "alt": "image alt"
      };
      editor.command(this._insertBlock, "media", data);
    }
  }

  private _insertBlock = (editor: Editor, type: "media" | "image", data: any, target: any) => {
    if (target) {
      editor.select(target)
    }

    editor.insertBlock({
      type,
      data,
    })
  }
}

export default RichTextExample