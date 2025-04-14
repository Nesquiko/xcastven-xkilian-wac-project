import { Component, h, Prop } from '@stencil/core';

type MenuButton = {
  title: string;
  icon: string;
  onClick: () => void;
};

@Component({
  tag: 'xcastven-xkilian-project-menu',
  shadow: false,
})
export class Menu {
  @Prop() isMenuOpen: boolean;
  @Prop() handleResetMenu: () => void;

  private menuButtons: Array<MenuButton> = [
    {
      title: "Home",
      icon: "home",
      onClick: () => {
        this.handleResetMenu();
        window.navigation.navigate("homepage");
      },
    },
    {
      title: "Schedule an appointment",
      icon: "event",
      onClick: () => {
        this.handleResetMenu();
        window.navigation.navigate("scheduleAppointment");
      },
    },
    {
      title: "Register a condition",
      icon: "coronavirus",
      onClick: () => {
        this.handleResetMenu();
        window.navigation.navigate("registerCondition");
      },
    },
    {
      title: "Account",
      icon: "account_circle",
      onClick: () => {
        this.handleResetMenu();
        window.navigation.navigate("account");
      },
    },
    {
      title: "Logout",
      icon: "logout",
      onClick: () => {
        this.handleResetMenu();
        sessionStorage.setItem("user", null);
        window.navigation.navigate("login");
      },
    },
  ] satisfies Array<MenuButton>;

  render() {
    return (
      <div
        class={`fixed top-0 left-0 z-100 h-full max-w-xs min-w-xs transform bg-white shadow-lg transition-transform duration-300 ${
          this.isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        onClick={(e: MouseEvent) => e.stopPropagation()}
      >
        <div class="flex h-full flex-col overflow-y-auto">
          <h2 class="w-full text-center text-lg font-medium bg-[#7357be] text-white px-4 py-3">
            Menu
          </h2>
          <div class="flex w-full flex-col items-center justify-center p-3">
            {this.menuButtons.map((menuButton: MenuButton) => (
              <div
                role="button"
                class="cursor-pointer rounded-full px-4 py-3 w-full flex flex-row items-center justify-between border-2 border-transparent hover:border-[#d8c7ed]"
                onClick={menuButton.onClick}
              >
                <span class="font-medium text-gray-600">{menuButton.title}</span>
                <md-icon class="text-gray-600">{menuButton.icon}</md-icon>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
