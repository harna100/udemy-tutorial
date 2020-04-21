import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
@Component({
    selector: 'app-post-home',
    templateUrl: './post-home.component.html',
    styleUrls: ['./post-home.component.css']
})

export class PostHomeComponent implements OnInit {
    isLoggedIn: boolean;

    constructor(private authService: AuthService) {}

    ngOnInit(): void {
        this.isLoggedIn = this.authService.isLoggedIn();
    }


}
