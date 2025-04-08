import { Component, h, State } from '@stencil/core';
import { StyledHost } from '../StyledHost';
import { UserRole } from '../../api/generated';

@Component({
  tag: 'xcastven-xkilian-project-register',
  shadow: false,
})
export class Register {
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

  private handleRegister = (role: UserRole) => {
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

    console.log("Register as", role, "with values:",
      "\nEmail:", this.email,
      "\nFirst Name:", this.firstName,
      "\nLast Name:", this.lastName,
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
            <span class="font-normal text-gray-200">Register at{" "}</span>
            <span class="font-medium text-white">MediCal</span>
          </h1>
          <div class="w-full p-6">
            <md-filled-text-field
              label="Email"
              class="w-full mb-6"
              value={this.email}
              onInput={(e: Event) => this.handleEmailChange(e)}
            />
            <div class="flex flex-row justify-between gap-x-3 items-center">
              <md-filled-text-field
                label="First Name"
                class="w-full mb-6"
                value={this.firstName}
                onInput={(e: Event) => this.handleFirstNameChange(e)}
              />
              <md-filled-text-field
                label="Last Name"
                class="w-full mb-6"
                value={this.lastName}
                onInput={(e: Event) => this.handleLastNameChange(e)}
              />
            </div>

            {this.emailError ? (
              <div class="w-full text-center mb-6 text-red-500 text-sm">{this.emailError}</div>
            ) : this.firstNameError ? (
              <div class="w-full text-center mb-6 text-red-500 text-sm">{this.firstNameError}</div>
            ) : this.lastNameError && (
              <div class="w-full text-center mb-6 text-red-500 text-sm">{this.lastNameError}</div>
            )}

            <div class="flex flex-row justify-between gap-x-3 items-center">
              <md-text-button
                class="rounded-full px-4 py-3 w-1/2"
                onClick={() => this.handleRegister(UserRole.Doctor)}
              >
                Register as doctor
              </md-text-button>
              <md-filled-button
                class="bg-[#9d83c6] rounded-full px-4 py-3 w-1/2"
                onClick={() => this.handleRegister(UserRole.Patient)}
              >
                Register
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
