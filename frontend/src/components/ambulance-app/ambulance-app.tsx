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
        <div class="flex min-h-screen items-center justify-center bg-gray-50">
          <div class="p-6 text-center">
            <h1 class="mb-4 text-4xl font-bold">WAC Project</h1>
            <p class="mb-6 text-lg">
              <span class="font-medium">Lukas Castven</span> and <span class="font-medium">Michal Kilian</span>.
            </p>
            <a href="https://github.com/Nesquiko/xcastven-xkilian-wac-project" class="text-lg text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
              View the Repository
            </a>
          </div>
        </div>
      </StyledHost>
    );
  }
}
