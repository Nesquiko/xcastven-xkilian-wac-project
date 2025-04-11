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
    console.log(this.user);

    if (!this.user) return;

    return (
      <StyledHost class="flex h-screen w-full flex-col bg-gray-300 overflow-hidden">
        <xcastven-xkilian-project-header
          type="account"
        />

        {/* Content */}
        <div class="relative flex items-center justify-center flex-1 h-full w-full">
          <div class="p-6 mx-6 w-full max-w-md rounded-md bg-white shadow-lg md:mx-0">
            <div class="flex flex-row items-center justify-between">
              <span class="text-gray-600">First name:</span>
              <span class="font-medium text-[#7357be] text-base">{this.user.firstName}</span>
            </div>
            <div class="flex flex-row items-center justify-between">
              <span class="text-gray-600">Last name:</span>
              <span class="font-medium text-[#7357be] text-base">{this.user.lastName}</span>
            </div>
            <div class="flex flex-row items-center justify-between">
              <span class="text-gray-600">Email:</span>
              <span class="font-medium text-[#7357be] text-base">{this.user.email}</span>
            </div>
            <div class="flex flex-row items-center justify-between mb-6">
              <span class="text-gray-600">Role:</span>
              <span class="font-medium text-[#7357be] text-base">{this.user.role}</span>
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
