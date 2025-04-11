import { ApiError } from '../../api/api';
import { Api } from '../../api/api';
import { Registration, UserRole } from '../../api/generated';
import { StyledHost } from '../StyledHost';
import { Component, h, Prop, State } from '@stencil/core';

@Component({
  tag: 'xcastven-xkilian-project-register',
  shadow: false,
})
export class Register {
  @Prop() api: Api;

  @State() email: string;
  @State() firstName: string;
  @State() lastName: string;

  @State() emailError: string = null;
  @State() firstNameError: string = null;
  @State() lastNameError: string = null;

  private handleEmailChange = (event: Event) => {
    this.email = (event.target as HTMLTextAreaElement).value;
  };

  private handleFirstNameChange = (event: Event) => {
    this.firstName = (event.target as HTMLTextAreaElement).value;
  };

  private handleLastNameChange = (event: Event) => {
    this.lastName = (event.target as HTMLTextAreaElement).value;
  };

  private handleRegister = async (role: UserRole) => {
    this.emailError = null;
    this.firstNameError = null;
    this.lastNameError = null;

    if (!this.email) {
      this.emailError = 'Email is required';
    }

    if (!this.firstName) {
      this.firstNameError = 'First name is required';
    }

    if (!this.lastName) {
      this.lastNameError = 'Last name is required';
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (this.email && !emailRegex.test(this.email)) {
      this.emailError = 'Invalid email format';
    }

    if (this.emailError || this.firstNameError || this.lastNameError) {
      return;
    }

    let request: Registration;
    if (role === UserRole.Doctor) {
      request = {
        role: 'doctor',
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
        specialization: 'urologist',
      };
    } else {
      request = {
        role: 'patient',
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
      };
    }

    try {
      await this.api.auth.registerUser({ registration: request });
      window.navigation.navigate('login');
    } catch (err) {
      if (!(err instanceof ApiError)) {
        return;
      }

      if (err.errDetail.status === 409) {
        this.emailError = 'This email already has an account';
        return;
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
            <span class="font-normal text-gray-200">Register at </span>
            <span class="font-medium text-white">MediCal</span>
          </h1>
          <div class="w-full p-6">
            <md-filled-text-field
              label="Email"
              class="mb-6 w-full"
              value={this.email}
              onInput={(e: Event) => this.handleEmailChange(e)}
            />
            <div class="flex flex-row items-center justify-between gap-x-3">
              <md-filled-text-field
                label="First Name"
                class="mb-3 w-full"
                value={this.firstName}
                onInput={(e: Event) => this.handleFirstNameChange(e)}
              />
              <md-filled-text-field
                label="Last Name"
                class="mb-3 w-full"
                value={this.lastName}
                onInput={(e: Event) => this.handleLastNameChange(e)}
              />
            </div>

            {this.emailError ? (
              <div class="mb-3 w-full text-center text-sm text-red-500">{this.emailError}</div>
            ) : this.firstNameError ? (
              <div class="mb-3 w-full text-center text-sm text-red-500">{this.firstNameError}</div>
            ) : (
              this.lastNameError && (
                <div class="mb-3 w-full text-center text-sm text-red-500">{this.lastNameError}</div>
              )
            )}

            <md-text-button
              class="w-full rounded-full mb-3"
              onClick={() => window.navigation.navigate('login')}
            >
              Already have an account?
            </md-text-button>

            <div class="flex flex-row items-center justify-between gap-x-3">
              <md-text-button
                class="w-1/2 rounded-full px-4 py-3"
                onClick={() => this.handleRegister(UserRole.Doctor)}
              >
                Register as doctor
              </md-text-button>
              <md-filled-button
                class="w-1/2 rounded-full bg-[#9d83c6] px-4 py-3"
                onClick={() => this.handleRegister(UserRole.Patient)}
              >
                Register
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
