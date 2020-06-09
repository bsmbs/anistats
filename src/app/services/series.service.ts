import { Injectable } from '@angular/core';
import axios from 'axios';

import { UserService } from './user.service';

export interface Media {
  id: number,
  title: {
    romaji: string
  },
  coverImage: {
    medium: string
  }
}

@Injectable({
  providedIn: 'root'
})
export class SeriesService {
  list: Media[];

  constructor(private user: UserService) { }

  async getList() {
    await this.fetchList()
    .then(r => {
      const formatted = [].concat.apply([], r.map(x => (x.isCustomList ? [] : x.entries)));

      this.list = formatted.map(x => x.media);
      this.list.sort((a, b) => a.title.romaji.localeCompare(b.title.romaji));

      return this.list;
    });
  }

  async fetchMedia(media: number) {
    const q = `query($id: Int, $mediaId: Int, $page: Int, $perPage: Int) {
      Media (id: $mediaId) {
        id
        title {
          romaji
        }
        coverImage {
          large
        }
        bannerImage
        episodes
      }
      Page (page: $page, perPage: $perPage) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
          perPage
        }
        activities (sort: ID_DESC, mediaId: $mediaId, userId: $id) {
          __typename
          ... on ListActivity {
            id
            media {
              id
              title {
                romaji
              }
              coverImage {
                medium
              }
            }
            type
            createdAt
            status
            progress
          }
        }
      }
    }
    `;

    const vars = {
      id: this.user.userdata.id,
      mediaId: media,
      page: 1,
      perPage: 50
    };

    const resp = await axios.post('https://graphql.anilist.co',
      { query: q, variables: vars },
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
    const q = `query ($id: Int, $chunk: Int) {
      MediaListCollection (userId: $id, type: ANIME, chunk: $chunk, status_not_in: [PLANNING]) {
        lists {
          name
          isCustomList
          entries {
            id
            media {
              id
              coverImage {
                medium
              }
              title {
                romaji
              }
            }
          }
        }
      }
    }`;

    const vars = {
      id: this.user.userdata.id
    };

    const resp = await axios.post('https://graphql.anilist.co',
      { query: q, variables: vars },
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
