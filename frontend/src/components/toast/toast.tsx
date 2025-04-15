import { Component, h, Prop, State, Method, Element } from '@stencil/core';

@Component({
  tag: 'xcastven-xkilian-project-toast',
  shadow: false,
})
export class Toast {
  @Element() el: HTMLElement;
  @Prop() duration: number = 3000;
  @State() isVisible: boolean = false;
  @State() message: string = '';
  @State() type: 'success' | 'error' | 'info' = 'info';

  private timeoutId: number;

  @Method()
  async show(message: string, type: 'success' | 'error' | 'info' = 'info', duration?: number) {
    this.message = message;
    this.type = type;
    this.isVisible = true;

    clearTimeout(this.timeoutId);
    this.timeoutId = window.setTimeout(() => {
      this.isVisible = false;
    }, duration || this.duration);
  }

  render() {
    const typeClasses = {
      success: 'bg-green-100 border-green-500 text-green-800',
      error: 'bg-red-100 border-red-500 text-red-800',
      info: 'bg-blue-100 border-blue-500 text-blue-800',
    };

    const iconNames = {
      success: 'check_circle',
      error: 'error',
      info: 'info',
    };

    return (
      <div
        class={`fixed bottom-4 left-1/2 z-50 -translate-x-1/2 transform transition-all duration-300 ${
          this.isVisible
            ? 'translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-8 opacity-0'
        }`}
      >
        <md-elevated-card class={`border-l-4 ${typeClasses[this.type]}`}>
          <div class="flex items-center px-4 py-3">
            <md-icon class="mr-2">{iconNames[this.type]}</md-icon>
            <span>{this.message}</span>
          </div>
        </md-elevated-card>
      </div>
    );
  }
}
