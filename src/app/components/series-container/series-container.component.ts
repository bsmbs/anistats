import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-series-container',
  templateUrl: './series-container.component.html',
  styleUrls: ['./series-container.component.scss']
})
export class SeriesContainerComponent implements OnInit {
  name: string;

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    /*this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.name = this.route.snapshot
        console.log(this.name);
      }
    });*/
  }

  

}
