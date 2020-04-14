import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule, MatCardModule, MatButtonModule, MatToolbarModule, MatExpansionModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';


import { AppComponent } from './app.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { HeaderComponent } from './header/header.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { LoginComponent } from './login/login.component';
import { PostHomeComponent } from './posts/post-home/post-home.component';

const appRoutes: Routes = [
  { path: 'jwt/:jwt', component: LoginComponent},
  { path: 'login', component: LoginComponent},
  { path: 'posts', component: PostHomeComponent},
  { path: '', component: AppComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    PostCreateComponent,
    HeaderComponent,
    PostListComponent,
    LoginComponent,
    PostHomeComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // debugging purposes only
    ),
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
