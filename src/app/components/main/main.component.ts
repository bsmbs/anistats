import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, style, state, transition, animate } from '@angular/animations';

import { UserService } from '../../services/user.service';

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
    ]),
    trigger('help', [
      transition(':enter', [
        style({ opacity: 0, top: '24px' }),
        animate('200ms ease-out', style({ opacity: 1, top: '40px' }))
      ]),
      transition(':leave', [
        animate('200ms ease-out', style({ opacity: 0, top: '24px'}))
      ])
    ])
  ]
})
export class MainComponent implements OnInit {
  errorVisible: boolean = false;
  username: string = '';
  loading: boolean = false;

  showHelp: boolean = false;

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

  toggleHelp(): void {
    this.showHelp = !this.showHelp;
  }
}
