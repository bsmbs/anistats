import { Injectable } from '@angular/core';
import axios from 'axios';
import { fetchQuery, ActivityDay, ActivityDate, ActivityMedia } from '../activity-day';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  activities: ActivityDay[];
  prefetchedActivities: ActivityDay[];

  userId: number;
  avurl: string;
  username: string;

  apiPage: number = 1;
  apiLastPage: number;

  daysStrings = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

  constructor() { }

  parseActivities(activities): ActivityDay[] {
    let days: ActivityDay[] = [];

    activities.forEach(activity => {
      let timestamp = new Date(activity.createdAt * 1000);
      let date = timestamp.getDate(),
          month = timestamp.getMonth()+1,
          year = timestamp.getFullYear(),
          weekday = this.daysStrings[timestamp.getDay()],
          eps = 0;

      let activityDate: ActivityDate = {
        date, // 01
        month, // April
        year, // 2020
        weekday, // Wednesday
        time: timestamp.getTime()
      };

      switch(activity.status) {
        case "watched episode":
        case "rewatched episode":
          const episodesRange = activity.progress.split(" - ");
          
          if (episodesRange.length == 2) eps = parseInt(episodesRange[1]) - parseInt(episodesRange[0]) + 1;
          else eps = 1;

          break;
        case "completed":
          eps = 1;
          break;
        default:
          return;
      }

      let media: ActivityMedia = {
        id: activity.media.id,
        title: activity.media.title.romaji,
        image: activity.media.coverImage.medium,
        eps
      }

      let thisDay = days.find(x => this.compareDates(x.day, activityDate));
      
      if (thisDay) {
        thisDay.eps += eps

        let record = thisDay.anime.find(x => x.id == media.id);
        if(record) record.eps += eps;
        else thisDay.anime.push(media);
      } else days.push({
        day: activityDate,
        eps,
        anime: (media ? [media] : [])
      })
    })

    return days
  }

  async fetchActivity(page: number) {
    let vars = {
      page,
      perPage: 50,
      userId: this.userId
    }
    const apiResp = await axios.post(
      'https://graphql.anilist.co', 
      {
        query: fetchQuery,
        variables: vars
      }, 
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      }
    )

    return apiResp;
  }

  loadEarlier() {
      this.activities = this.activities.concat(this.prefetchedActivities);
    
      if(this.apiLastPage == this.apiPage) return;
  
      this.apiPage++;
  
      this.prefetch();
      
  }

  prefetch() {
    return new Promise((resolve) => {
      this.fetchActivity(this.apiPage+1).then(response2 => {
        this.apiLastPage = response2.data.data.Page.pageInfo.lastPage;
        this.prefetchedActivities = this.parseActivities(response2.data.data.Page.activities);
  
        let duplicates = this.prefetchedActivities.filter(x => this.compareDates(x.day, this.activities[this.activities.length-1].day));
  
        duplicates.forEach(n => {
          const match = (x) => this.compareDates(x.day, this.activities[this.activities.length-1].day)
          this.prefetchedActivities.splice(this.prefetchedActivities.findIndex(match), 1)
          
          let old = this.activities.find(match);
          old.anime = old.anime.concat(n.anime);
          old.eps += n.eps;
        })

        resolve();
      })
    })
  }

  compareDates(date1: ActivityDate, date2: ActivityDate) {
    return (date1.date == date2.date && date1.month == date2.month && date1.year == date2.year);
  }

  get nextPage(): boolean {
    return (this.apiLastPage != this.apiPage)
  }
}
