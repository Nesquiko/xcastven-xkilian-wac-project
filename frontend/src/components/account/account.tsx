import { User } from '../../api/generated';
import { StyledHost } from '../StyledHost';
import { Component, h } from '@stencil/core';

@Component({
  tag: 'xcastven-xkilian-project-account',
  shadow: false,
})
export class Account {
  private user: User = JSON.parse(sessionStorage.getItem('user'));

  private handleBack = () => {
    window.navigation.back();
  };

  private handleLogOut = () => {
    window.navigation.navigate('login');

    sessionStorage.setItem('user', null);
  };

  render() {
    if (!this.user) return;

    return (
      <StyledHost class="flex h-screen w-full flex-col overflow-hidden bg-gray-300">
        <xcastven-xkilian-project-header type="account" />

        {/* Content */}
        <div class="relative flex h-full w-full flex-1 items-center justify-center">
          <div class="mx-6 w-full max-w-md rounded-md bg-white p-6 shadow-lg md:mx-0">
            <div class="flex flex-row items-center justify-between">
              <span class="text-gray-600">First name:</span>
              <span class="text-base font-medium text-[#7357be]">{this.user.firstName}</span>
            </div>
            <div class="flex flex-row items-center justify-between">
              <span class="text-gray-600">Last name:</span>
              <span class="text-base font-medium text-[#7357be]">{this.user.lastName}</span>
            </div>
            <div class="flex flex-row items-center justify-between">
              <span class="text-gray-600">Email:</span>
              <span class="text-base font-medium text-[#7357be]">{this.user.email}</span>
            </div>
            <div class="mb-6 flex flex-row items-center justify-between">
              <span class="text-gray-600">Role:</span>
              <span class="text-base font-medium text-[#7357be]">{this.user.role}</span>
            </div>

            <div class="flex flex-row items-center justify-between gap-x-3">
              <md-outlined-button class="w-1/2" onClick={this.handleBack}>
                Back
              </md-outlined-button>
              <md-outlined-button class="w-1/2" onClick={this.handleLogOut}>
                Log out
              </md-outlined-button>
            </div>
          </div>
        </div>
      </StyledHost>
    );
  }
}
