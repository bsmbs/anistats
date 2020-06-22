import { Injectable } from '@angular/core';
import axios from 'axios';

import { UserService } from './user.service';
import { listQuery, mediaQuery } from '../interfaces/queries';
import { activityDateFromDate, ActivityDate } from '../interfaces/activity-day';

export interface Media {
  id: number,
  title: string,
  coverImage: {
    medium: string
  },
  format: string,
  status: string,
  progress: number,
  added: ActivityDate
}

@Injectable({
  providedIn: 'root'
})
export class SeriesService {
  list: Media[];

  constructor(private user: UserService) { }

  async ensureList(): Promise<Media[]> {
    if (typeof this.list == 'undefined') { 
      const list = await this.fetchList();

      // Merge all lists into one, remove custom lists
      const formatted = [].concat.apply([], list.map(x => (x.isCustomList ? [] : x.entries)));

      this.list = formatted
                  .map(x => ({
                    ...x.media,
                    id: x.id,
                    title: x.media.title.romaji,
                    status: x.status,
                    progress: x.progress,
                    started: x.startedAt,
                    completed: x.completedAt,
                    added: activityDateFromDate(new Date(x.createdAt*1000)),
                  })) 
                  .sort((a, b) => a.title.localeCompare(b.title)); // Sort alphabetically
    }

    return this.list;
  }

  async fetchMedia(media: number) {
    const vars = {
      id: this.user.userdata.id,
      mediaId: media,
      page: 1,
      perPage: 50
    };

    const resp = await axios.post('https://graphql.anilist.co',
      { query: mediaQuery, variables: vars },
      { headers:
        {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }
      }
    );

    return resp.data.data;
  }

  async fetchList() {

    const vars = {
      id: this.user.userdata.id
    };

    const resp = await axios.post('https://graphql.anilist.co',
      { query: listQuery, variables: vars },
      { headers:
        {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }
      }
    );

    return resp.data.data.MediaListCollection.lists;
  }
}
