import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Sesion } from '../services/sesion';

export const adminGuard: CanActivateFn = () => {
  const sesion = inject(Sesion)
  const router = inject(Router)

  if (sesion.esAdmin()) {
    return true
  }
  return router.createUrlTree([sesion.autenticado() ? '/catalogo' : '/login'])
};
