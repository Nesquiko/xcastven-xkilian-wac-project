import { Component, h, Prop, State } from '@stencil/core';
import { StyledHost } from '../StyledHost';

@Component({
  tag: 'xcastven-xkilian-project-app',
})
export class App {
  @State() private relativePath: string = "";

  @Prop() basePath: string = "";

  componentWillLoad() {
    const baseUri = new URL(this.basePath, document.baseURI || "/").pathname;

    const toRelative = (path: string) => {
      if (path.startsWith( baseUri)) {
        this.relativePath = path.slice(baseUri.length);
      } else {
        this.relativePath = "";
      }
    };

    window.navigation?.addEventListener("navigate", (ev: Event) => {
      if ((ev as any).canIntercept) { (ev as any).intercept(); }
      let path = new URL((ev as any).destination.url).pathname;
      toRelative(path);
    });

    toRelative(location.pathname);
  };

  render() {
    let element: string = "homepage";
    let entryId: string = "@new";

    if (this.relativePath.startsWith("homepage")) {
      element = <xcastven-xkilian-project-homepage />;
    } else if (this.relativePath.startsWith("login")) {
      element = <xcastven-xkilian-project-login />;
    } else if (this.relativePath.startsWith("register")) {
      element = <xcastven-xkilian-project-register />;
    } else if (this.relativePath.startsWith("scheduleAppointment")) {
      element = <xcastven-xkilian-project-appointment-scheduler />;
    }

    /*const navigate = (path:string) => {
      const absolute = new URL(path, new URL(this.basePath, document.baseURI)).pathname;
      window.navigation.navigate(absolute)
    };*/

    return (
      <StyledHost>
        {element}
      </StyledHost>
    );
  };
}
