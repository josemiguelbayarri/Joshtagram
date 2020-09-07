import React from 'react';

export default function Loading() {//creamoas nuestro elemento loading para motrarlo cada vez que algo se cargue en la pagina para mostrar este efecto
  return (
    <div className="Loading">
      <div className="Loading__dot-1" />
      <div className="Loading__dot-2" />
      <div className="Loading__dot-3" />
    </div>
  );
}
