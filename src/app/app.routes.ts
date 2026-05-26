import { Routes } from '@angular/router';
import { LoginPage } from './login-page/login-page';
import { ResetPasswordPage } from './reset-password-page/reset-password-page';
import { LoginScreen } from './login-screen/login-screen';
import { MainPage } from './main-page/main-page';

export const routes: Routes = [
    {
        path: "login",
        component: LoginScreen
    },
    {
        path: "reset",
        component: ResetPasswordPage
    },
    {
        path: "main",
        component: MainPage
    }
];
