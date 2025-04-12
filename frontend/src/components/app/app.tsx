import { newApi } from '../../api/api';
import { User } from '../../api/generated';
import { StyledHost } from '../StyledHost';
import { Component, h, Prop, State } from '@stencil/core';

@Component({
  tag: 'xcastven-xkilian-project-app',
})
export class App {
  @Prop() apiBase: string = 'http://localhost:42069';
  @Prop() basePath: string = '';

  @State() private relativePath: string = '';

  private api = newApi(this.apiBase);

  componentWillLoad() {
    const baseUri = new URL(this.basePath, document.baseURI || '/').pathname;

    const toRelative = (path: string) => {
      if (path.startsWith(baseUri)) {
        this.relativePath = path.slice(baseUri.length);
      } else {
        this.relativePath = '';
      }
    };

    window.navigation?.addEventListener('navigate', (ev: Event) => {
      if ((ev as any).canIntercept) {
        (ev as any).intercept();
      }
      const path = new URL((ev as any).destination.url).pathname;
      toRelative(path);
    });

    toRelative(location.pathname);
  }

  render() {
    let element: string;
    const user: User | null = JSON.parse(sessionStorage.getItem('user'));

    if (!user && !this.relativePath.startsWith('register')) {
      element = <xcastven-xkilian-project-login api={this.api} />;
    } else {
      if (this.relativePath === '' || this.relativePath.startsWith('homepage')) {
        element = <xcastven-xkilian-project-home-page api={this.api} />;
      } else if (this.relativePath.startsWith('login')) {
        element = <xcastven-xkilian-project-login api={this.api} />;
      } else if (this.relativePath.startsWith('registerCondition')) {
        const urlParams = new URLSearchParams(window.location.search);
        const start: string = urlParams.get('start');
        element = (
          <xcastven-xkilian-project-condition-registerer
            startDate={start ? new Date(start) : null}
            api={this.api}
            user={user}
          />
        );
      } else if (this.relativePath.startsWith('register')) {
        element = <xcastven-xkilian-project-register api={this.api} />;
      } else if (this.relativePath.startsWith('scheduleAppointment')) {
        const urlParams = new URLSearchParams(window.location.search);
        const date: string = urlParams.get('date');
        element = (
          <xcastven-xkilian-project-appointment-scheduler
            initialDate={date ? new Date(date) : null}
            api={this.api}
            user={user}
          />
        );
      } else if (this.relativePath.startsWith('account')) {
        element = <xcastven-xkilian-project-account />;
      }
    }

    /*const navigate = (path:string) => {
      const absolute = new URL(path, new URL(this.basePath, document.baseURI)).pathname;
      window.navigation.navigate(absolute)
    };*/

    return <StyledHost>{element}</StyledHost>;
  }
}
