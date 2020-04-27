import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { Router } from '@angular/router';
import { UserService } from '../user/user.service';
import { trigger, style, state, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  animations: [
    trigger('showError', [
      transition(':enter', [
        style({ opacity: 0, bottom: 0 }),
        animate('300ms ease-out', style({ opacity: 1, bottom: '50px' }))
      ]),
      transition(':leave', [
        animate('200ms ease-out', style({ opacity: 0, bottom: 0 }))
      ]
      )
    ])
  ]
})
export class MainComponent implements OnInit {
  errorVisible: boolean = false;
  username: string = '';
  loading: boolean = false;

  constructor(private router: Router, private user: UserService) { }

  ngOnInit(): void {
  }

  send() {
    // string check
    if (this.username.length == 0 || this.username.length > 128) return;
    this.loading = true;
    // api request
    this.user.fetchUserByName(this.username)
    .then(id => {
      this.loading = false;
      this.router.navigate(['/stats', id, 'overview']);
    })
    .catch(() => {
      this.loading = false;
      this.errorVisible = true;
      setTimeout(() => { this.errorVisible = false; }, 2000);
    });
  }
}
