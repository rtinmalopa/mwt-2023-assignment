import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/guards/auth.guard';
import { DeactivateGuard } from 'src/guards/deactivate.guard';
import { EditUserComponent } from './edit-user/edit-user.component';
import { ExtendedUsersComponent } from './extended-users/extended-users.component';
import { LoginComponent } from './login/login.component';
import { Page404Component } from './page404/page404.component';
import { RegisterComponent } from './register/register.component';
import { UsersComponent } from './users/users.component';
import { FilmAddComponent } from 'src/modules/films/film-add/film-add.component';
import { FilmEditComponent } from 'src/modules/films/film-edit/film-edit.component';

const routes: Routes = [
  {path: "users", component: UsersComponent},
  {path: "extended-users", 
   component: ExtendedUsersComponent,
   canActivate: [AuthGuard]
  },
  {path: "user/edit/:id", component: EditUserComponent, data: {hocico: true},
   canActivate: [AuthGuard],
   canDeactivate: [DeactivateGuard]
  },
  {path: "user/new", 
   component: EditUserComponent,
   canActivate: [AuthGuard],
   canDeactivate: [DeactivateGuard]
  },
  {path: "login", component: LoginComponent},
  {path: "register", component: RegisterComponent},
  { path: "groups", 
    canMatch: [AuthGuard],
    loadChildren: () => 
     import('../modules/groups/groups.module').then(mod => mod.GroupsModule)},
  { path: "films",
    loadChildren: () => 
    import('../modules/films/films.module').then(mod => mod.FilmsModule)
  },
  { path: "chat",
    loadChildren: () => 
    import('../modules/chat/chat.module').then(mod => mod.ChatModule)
  },
  { path: 'films/edit/:id', component: FilmEditComponent },
  { path: 'films/add', component: FilmAddComponent },
  {path: "", redirectTo: "users", pathMatch: "full"},
  {path: "**", component: Page404Component}

];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
