import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
@Component({
    selector: 'app-post-home',
    templateUrl: './post-home.component.html',
    styleUrls: ['./post-home.component.css']
})

export class PostHomeComponent implements OnInit, OnDestroy {
    isLoggedIn: boolean;
    private userIdSetSub: Subscription;

    constructor(private authService: AuthService) {}

    ngOnInit(): void {
        this.userIdSetSub = this.authService.userIdSet.subscribe(
            () => {
                this.isLoggedIn = this.authService.isLoggedIn();
                console.log("Home heard event: " + this.isLoggedIn);

            }
        );

        console.log("Home init: " + this.isLoggedIn);
        this.isLoggedIn = this.authService.isLoggedIn();
    }

    ngOnDestroy(): void {
        this.userIdSetSub.unsubscribe();
    }


}
