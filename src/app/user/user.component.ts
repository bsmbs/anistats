import { Component, OnInit, OnDestroy } from '@angular/core';
import { StatsService } from '../stats/stats.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

import { UserService } from './user.service';
import { Subscription } from 'rxjs';
import { SeriesService } from '../series/series.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  providers: [StatsService, SeriesService]
})
export class UserComponent implements OnInit, OnDestroy {
  sub: Subscription;
  name: string;
  mobile: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router, private breakpointObserver: BreakpointObserver, private statsService: StatsService, public user: UserService) {
    this.route.params.subscribe(params => {
      if (typeof this.user.userdata === 'undefined') {
        this.user.fetchUserById(params.id)
          .then(d => {
            this.statsService.userId = d.id;
          })
      } else {
        this.statsService.userId = this.user.userdata.id;
      }
    })

    this.sub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.name = this.route.snapshot.firstChild.url[0].path;
      }
    })

    this.breakpointObserver
    .observe(['(min-width: 760px)'])
    .subscribe((state: BreakpointState) => {
      this.mobile = !state.matches;
    })
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
