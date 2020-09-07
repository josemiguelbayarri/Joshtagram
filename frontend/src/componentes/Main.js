import React from 'react';

export default function Main({ children, center }) {// destructuramos children y center
  let classes = `Main ${center ? 'Main--center' : ''}`;// creamos una variable  classes y le damos la propiedad css center en el caso de que main sea true para poder aplicarla

  return <main className={classes}>{children}</main>;// aqui le decimos que la variable classes afecte solo a los children de main
}
