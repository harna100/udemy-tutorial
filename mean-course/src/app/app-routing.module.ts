import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginComponent } from './login/login.component';
import { PostHomeComponent } from './posts/post-home/post-home.component';
import { AppComponent } from './app.component';

const appRoutes: Routes = [
    { path: 'jwt', component: LoginComponent},
    { path: 'login', component: LoginComponent},
    { path: 'posts', component: PostHomeComponent},
    { path: '', component: AppComponent}
  ];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    )
  ],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule {}
