import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'xcastven-xkilian-project-no-data',
  shadow: false,
})
export class NoData {
  @Prop() displayTitle: string;
  @Prop() icon: string = "error";
  @Prop() iconSize: number = 80;

  render() {
    const iconFontSize: string = this.iconSize.toString() + "px";

    return (
      <div class="w-full h-full flex flex-1 items-center justify-center">
        <div class="max-w-sm flex flex-col items-center justify-center gap-y-3 text-gray-600 font-medium">
          <md-icon class="h-full w-full" style={{ fontSize: iconFontSize }}>{this.icon}</md-icon>
          <h2 class="text-center text-xl">{this.displayTitle}</h2>
        </div>
      </div>
    );
  };
}
