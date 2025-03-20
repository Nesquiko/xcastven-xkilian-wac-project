import { StyledHost } from '../StyledHost';
import { Component, h } from '@stencil/core';

@Component({
  tag: 'ambulance-app',
  shadow: true,
})
export class AmbulanceApp {
  render() {
    return (
      <StyledHost>
        <div class="flex justify-center rounded-md bg-indigo-500 p-2">
          <h1 class="font-sans text-white">This is a Stencil component using Tailwind</h1>
        </div>
      </StyledHost>
    );
  }
}
