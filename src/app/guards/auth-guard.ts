import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Sesion } from '../services/sesion';

export const authGuard: CanActivateFn = () => {
  const sesion = inject(Sesion)
  const router = inject(Router)

  return sesion.autenticado() ? true : router.createUrlTree(['/login'])
};
