import { Component, h } from '@stencil/core';
import { createRouter, Route } from 'stencil-router-v2';
import { StyledHost } from '../StyledHost';

const Router = createRouter();

@Component({
  tag: 'xcastven-xkilian-project-app',
})
export class App {
  render() {
    return (
      <StyledHost>
        <Router.Switch>
          <Route path="/home">
            <xcastven-xkilian-project-home-page></xcastven-xkilian-project-home-page>
          </Route>

          <Route path="/login">
            <xcastven-xkilian-project-login></xcastven-xkilian-project-login>
          </Route>

          <Route path="/register">
            <xcastven-xkilian-project-register></xcastven-xkilian-project-register>
          </Route>

          <Route path="/scheduleAppointment">
            <xcastven-xkilian-project-appointment-scheduler></xcastven-xkilian-project-appointment-scheduler>
          </Route>
        </Router.Switch>
      </StyledHost>
    );
  }
}
