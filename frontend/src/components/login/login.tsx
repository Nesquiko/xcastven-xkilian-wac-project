import { Component, h, State } from '@stencil/core';
import { StyledHost } from '../StyledHost';
import { UserRole } from '../../api/generated';

@Component({
  tag: 'xcastven-xkilian-project-login',
  shadow: false,
})
export class Login {
  @State() email: string;

  @State() emailError: string;

  private handleEmailChange = (event: Event) => {
    this.email = (event.target as HTMLTextAreaElement).value;
  };

  private handleLogin = (role: UserRole) => {
    this.emailError = null;

    if (!this.email) {
      this.emailError = 'Email is required';
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (this.email && !emailRegex.test(this.email)) {
      this.emailError = 'Invalid email format';
    }

    if (this.emailError) {
      return;
    }

    console.log("Login as", role, "with values:",
      "\nEmail:", this.email,
      "\nRole:", role,
    );
  };

  render() {
    return (
      <StyledHost class="flex h-screen flex-row w-full justify-center items-center overflow-hidden bg-gray-300">
        <div class="hidden md:block w-1/3 h-full">
          <img
            src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExa2s0aXUxZnRjeGUyZXZwYnk0N3M4ZHM0dDY4eWdrYmQ5a2VvcnFpdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/7Y8heHVtaDehy/giphy.gif"
            alt="Doctor Left"
            class="h-full w-full object-cover"
          />
        </div>

        <div class="w-full max-w-md bg-white shadow-lg rounded-md mx-6 md:mx-0">
          <h1 class="w-full text-2xl text-center mb-3 bg-[#7357be] px-4 py-3 rounded-t-lg">
            <span class="font-normal text-gray-200">Login at{' '}</span>
            <md-icon class="text-white" style={{ fontSize: '16px' }}>
              syringe
            </md-icon>
            <span class="font-medium text-white">MediCal</span>
          </h1>
          <div class="w-full p-6">
            <md-filled-text-field
              label="Email"
              class="w-full mb-6"
              value={this.email}
              onInput={(e: Event) => this.handleEmailChange(e)}
            />

            {this.emailError && (
              <div class="w-full text-center mb-6 text-red-500 text-sm">{this.emailError}</div>
            )}

            <div class="flex flex-row justify-between gap-x-3 items-center">
              <md-text-button
                class="rounded-full px-4 py-3 w-1/2"
                onClick={() => this.handleLogin(UserRole.Doctor)}
              >
                Login as doctor
              </md-text-button>
              <md-filled-button
                class="bg-[#9d83c6] rounded-full px-4 py-3 w-1/2"
                onClick={() => this.handleLogin(UserRole.Patient)}
              >
                Login
              </md-filled-button>
            </div>
          </div>
        </div>

        <div class="hidden md:block w-1/3 h-full">
          <img
            src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHMzcm1idnlmZGd4Zzc3NngwZzk0eTRlbmJ5OHFmMDNwaHllZmd5cCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/3ov9k3cUEZ7ZlOHQpW/giphy.gif"
            alt="Doctor Right"
            class="h-full w-full object-cover"
          />
        </div>
      </StyledHost>
    );
  }
}
