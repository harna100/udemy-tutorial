import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy {

    private userIdSetSub: Subscription;
    isLoggedIn: boolean;

    constructor(private authService: AuthService) {}

    ngOnInit(): void {
        this.isLoggedIn = this.authService.isLoggedIn();
        this.userIdSetSub = this.authService.userIdSet.subscribe(
            () => {
                this.isLoggedIn = this.authService.isLoggedIn();
            }
        );
    }

    ngOnDestroy(): void {
        this.userIdSetSub.unsubscribe();
    }
}
