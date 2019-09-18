import * as React from 'react';
import Button from './Button';
import Icon from './Icon';
import { Dialog, DialogType } from "office-ui-fabric-react/lib/Dialog"
import { TextField } from "office-ui-fabric-react/lib/TextField"
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Editor } from 'slate-react';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';

export interface IState {
  showDialog: boolean;
  src: string;
  height: string;
  width: string;
  embedCode: string;
  error: string;
  activeTab: string;
}

export interface IProps {
  editor: Editor | null;
}

export default class ImageInsertButton extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);

    this.state = {
      showDialog: false,
      src: "",
      height: "315",
      width: "560",
      embedCode: "",
      error: "",
      activeTab: "General"
    }
  }

  public render() {
    return (
      <React.Fragment>
        <Button onMouseDown={this._openImagePickerDialog} >
          <Icon iconName="Media" />
        </Button>
        <div style={{ position: "absolute" }}>
          <Dialog
            isOpen={this.state.showDialog}
            onDismiss={this._closeImagePickerDialog}
            title="Insert Video"
            type={DialogType.normal}
            minWidth={500}
          >
            {this.state.error &&
              <MessageBar
                messageBarType={MessageBarType.error}
              >
                {this.state.error}
              </MessageBar>
            }
            <Pivot
              onLinkClick={this._onSwitchForm}
            >
              <PivotItem
                headerText="General"
                headerButtonProps={{
                  'data-order': 1,
                  'data-title': 'General'
                }}
              >
                {this._videoUrlForm()}
              </PivotItem>
              <PivotItem
                key="embed"
                headerText="Embed"
                headerButtonProps={{
                  'data-order': 2,
                  'data-title': 'Embed'
                }}
              >
                {this._embedForm()}
              </PivotItem>
            </Pivot>
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
  private _updateEmbedCode = (e: any, value?: string) => {
    this.setState({ embedCode: value || "" });
    if (value) {
      const parser = new DOMParser();
      const document = parser.parseFromString(value, "text/html")
      const iframe = document.getElementsByTagName("iframe")[0];

      if (iframe) {
        this.setState({
          src: iframe.src,
          height: iframe.height,
          width: iframe.width,
        })
      } else {
        this.setState({ error: "Invalid Embed Code !" });
        this._resetFormValues();
      }
    } else {
      this._resetFormValues();
    }

  };
  private _onSwitchForm = (item?: PivotItem) => {
    if (item) {
      if (item.props.headerText !== this.state.activeTab) {
        this.setState({
          activeTab: item.props.headerText || "",
          error: "",
          embedCode: "",
        })
      }
    }
  }

  private _resetFormValues = () => this.setState({ src: "", height: "", width: "" });

  private _onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (this.state.error) {
      return;
    }
    const height = isNaN(Number(this.state.height)) ? this.state.height : this.state.height;
    const width = isNaN(Number(this.state.width)) ? this.state.width : this.state.width;
    let src = "";

    if (this.state.src.indexOf("youtube") >= 0) {
      if (this.state.src.indexOf("embed") >= 0) {
        src = this.state.src;
      } else {
        let videoId = "";
        const url = new URL(this.state.src);
        videoId = url.searchParams.get("v") || "";
        src = `https://www.youtube.com/embed/${videoId}`
      }
    } else {
      src = this.state.src;
    }

    const data = {
      src,
      height,
      width,
    };

    if (this.props.editor) {
      this.props.editor.insertBlock({
        type: "media",
        data,
      })
    }

    this._closeImagePickerDialog();
    this.setState({
      embedCode: "",
      height: "",
      src: "",
      width: "",
    })
  }

  private _embedForm() {
    return (
      <form
        onSubmit={this._onSubmit}
        style={{ padding: "10px" }}
      >
        <TextField
          multiline
          label="Embed Code"
          value={this.state.embedCode}
          onChange={this._updateEmbedCode}
          height={300}
          required
          style={{ height: "100px" }}
        />
        <footer style={{
          marginTop: "10px",
          textAlign: "right",
        }}>
          <DefaultButton type="button" text="Close" onClick={this._closeImagePickerDialog} style={{ marginRight: "10px" }} />
          <PrimaryButton type="submit" text="Insert" />
        </footer>
      </form>
    );
  }

  private _videoUrlForm() {
    return (
      <form
        onSubmit={this._onSubmit}
        style={{ padding: "10px" }}
      >
        <TextField label="Video Url" value={this.state.src} onChange={this._updateSrc} required />
        <div style={{
          display: "flex",
          justifyContent: "space-between"
        }}>
          <TextField label="Height" value={this.state.height} onChange={this._updateHeight} styles={{ root: { marginRight: "5px", width: "100%" } }} />
          <TextField label="Width" value={this.state.width} onChange={this._updateWidth} styles={{ root: { marginLeft: "5px", width: "100%" } }} />
        </div>

        <footer style={{
          marginTop: "10px",
          textAlign: "right",
        }}>
          <DefaultButton type="button" text="Close" onClick={this._closeImagePickerDialog} style={{ marginRight: "10px" }} />
          <PrimaryButton type="submit" text="Insert" />
        </footer>
      </form>
    );
  }
}