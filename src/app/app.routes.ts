import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin-guard';
import { authGuard } from './guards/auth-guard';
import { Catalogo } from './pages/catalogo/catalogo';
import { Login } from './pages/login/login';
import { Panel } from './pages/panel/panel';
import { Registro } from './pages/registro/registro';

export const routes: Routes = [
    {path: "login", component:Login},
    {path: "registro", component:Registro},
    {path: "catalogo", component:Catalogo, canActivate:[authGuard]},
    {path: "panel", component:Panel, canActivate:[adminGuard]},

    {path: "", redirectTo:"catalogo", pathMatch:'full'},
    {path: "**", redirectTo:"catalogo"}
];
