import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/models/post.model';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    ngOnInit(): void {
        console.log(this.route.snapshot.paramMap.get('jwt'));
        this.route.paramMap.pipe(
            switchMap((params: ParamMap) => {
              localStorage.setItem('jwt', params.get('jwt'));
              this.router.navigateByUrl('posts');
              return Observable;
            })
        ).subscribe();
    }

    constructor(private route: ActivatedRoute, private router: Router, public authService: AuthService) {}

}
