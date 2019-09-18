import * as React from 'react';
import Button from './Button';
import Icon from './Icon';
import { Dialog } from "office-ui-fabric-react/lib/Dialog"
import { TextField } from "office-ui-fabric-react/lib/TextField"
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Editor } from 'slate-react';

export interface IState {
  showDialog: boolean;
  src: string;
  height: string;
  width: string;
  alt: string;
}

export interface IProps {
  editor: Editor | null;
}

export default class ImageInsertButton extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);

    this.state = {
      showDialog: false,
      alt: "",
      height: "",
      src: "",
      width: "",
    }
  }

  public render() {
    return (
      <React.Fragment>
        <Button onMouseDown={this._openImagePickerDialog} >
          <Icon iconName="Photo2" />
        </Button>
        <div style={{ position: "absolute" }}>
          <Dialog
            isOpen={this.state.showDialog}
            onDismiss={this._closeImagePickerDialog}
            title="Insert Image"
          >
            <form onSubmit={this._onSubmit}>
              <TextField
                label="Image Url"
                value={this.state.src}
                onChange={this._updateSrc}
                required
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between"
                }}
              >
                <TextField
                  label="Height"
                  value={this.state.height}
                  onChange={this._updateHeight}
                  styles={{ root: { marginRight: "5px" } }}
                />
                <TextField
                  label="Width"
                  value={this.state.width}
                  onChange={this._updateWidth}
                  styles={{ root: { marginLeft: "5px" } }}

                />
              </div>
              <TextField
                label="Alt"
                value={this.state.alt}
                onChange={this._updateAlt}
              />
              <footer
                style={{
                  marginTop: "10px",
                  textAlign: "right",
                }}
              >
                <DefaultButton
                  type="button"
                  text="Close"
                  onClick={this._closeImagePickerDialog}
                  style={{ marginRight: "10px" }}
                />
                <PrimaryButton type="submit" text="Insert" />
              </footer>
            </form>
          </Dialog>
        </div>
      </React.Fragment>
    )
  }

  private _openImagePickerDialog = () => this.setState({ showDialog: true });
  private _closeImagePickerDialog = () => this.setState({ showDialog: false });
  private _updateSrc = (e: any, value?: string) => { this.setState({ src: value || "" }) };
  private _updateHeight = (e: any, value?: string) => { this.setState({ height: value || "" }) };
  private _updateWidth = (e: any, value?: string) => { this.setState({ width: value || "" }) };
  private _updateAlt = (e: any, value?: string) => { this.setState({ alt: value || "" }) };

  private _onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const height = isNaN(Number(this.state.height)) ? this.state.height : this.state.height + "px";
    const width = isNaN(Number(this.state.width)) ? this.state.width : this.state.width + "px";
    const data = {
      src: this.state.src,
      alt: this.state.alt,
      height,
      width,
    };

    if (this.props.editor) {
      this.props.editor.insertBlock({
        type: "image",
        data,
      })
    }

    this._closeImagePickerDialog();
  }
}