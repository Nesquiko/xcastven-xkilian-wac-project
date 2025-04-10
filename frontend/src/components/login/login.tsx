import { Api, ApiError } from '../../api/api';
import { UserRole } from '../../api/generated';
import { StyledHost } from '../StyledHost';
import { Component, h, Prop, State } from '@stencil/core';

@Component({
  tag: 'xcastven-xkilian-project-login',
  shadow: false,
})
export class Login {
  @Prop() api: Api;

  @State() email: string;

  @State() emailError: string;

  private handleEmailChange = (event: Event) => {
    this.email = (event.target as HTMLTextAreaElement).value;
  };

  private handleLogin = async (role: UserRole) => {
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

    try {
      const user = await this.api.auth.loginUser({ loginRequest: { email: this.email, role } });
      sessionStorage.setItem('user', JSON.stringify(user));
      window.navigation.navigate('homepage');
    } catch (err) {
      if (!(err instanceof ApiError)) {
        return;
      }

      if (err.errDetail.status === 404) {
        // TODO kili email not found
      }
    }
  };

  render() {
    return (
      <StyledHost class="flex h-screen w-full flex-row items-center justify-center overflow-hidden bg-gray-300">
        <div class="hidden h-full w-1/3 md:block">
          <img
            src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExa2s0aXUxZnRjeGUyZXZwYnk0N3M4ZHM0dDY4eWdrYmQ5a2VvcnFpdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/7Y8heHVtaDehy/giphy.gif"
            alt="Doctor Left"
            class="h-full w-full object-cover"
          />
        </div>

        <div class="mx-6 w-full max-w-md rounded-md bg-white shadow-lg md:mx-0">
          <h1 class="mb-3 w-full rounded-t-lg bg-[#7357be] px-4 py-3 text-center text-2xl">
            <span class="font-normal text-gray-200">Login at </span>
            <md-icon class="text-white" style={{ fontSize: '16px' }}>
              syringe
            </md-icon>
            <span class="font-medium text-white">MediCal</span>
          </h1>
          <div class="w-full p-6">
            <md-filled-text-field
              label="Email"
              class="mb-6 w-full"
              value={this.email}
              onInput={(e: Event) => this.handleEmailChange(e)}
            />

            {this.emailError && (
              <div class="mb-6 w-full text-center text-sm text-red-500">{this.emailError}</div>
            )}

            <div class="flex flex-row items-center justify-between gap-x-3">
              <md-text-button
                class="w-1/2 rounded-full px-4 py-3"
                onClick={() => this.handleLogin(UserRole.Doctor)}
              >
                Login as doctor
              </md-text-button>
              <md-filled-button
                class="w-1/2 rounded-full bg-[#9d83c6] px-4 py-3"
                onClick={() => this.handleLogin(UserRole.Patient)}
                type="submit"
              >
                Login
              </md-filled-button>
            </div>
          </div>
        </div>

        <div class="hidden h-full w-1/3 md:block">
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
