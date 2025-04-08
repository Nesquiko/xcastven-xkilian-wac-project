import { getAssetPath, h, Host } from '@stencil/core';

export const StyledHost: typeof Host = (attrs, children) => {
  return (
    <Host {...attrs}>
      <link rel="stylesheet" href={getAssetPath('xcastven-xkilian-project.css')} />
      <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      {children}
    </Host>
  );
};
