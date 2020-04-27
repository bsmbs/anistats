import { Injectable } from '@angular/core';
import axios from 'axios';

interface UserData {
  id: number;
  username: string;
  avurl: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userdata: UserData;

  constructor() { }

  async fetchUserByName(username: string) {
    const q = `
    query ($name: String) {
      User (name: $name) {
        id
        name
        avatar {
          medium
        }
      }
    }`;

    const vars = {
      name: username
    };

    try {
      const resp = await axios.post('https://graphql.anilist.co',
      { query: q, variables: vars },
      { headers:
        {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }
      }
    );

      this.userdata = {
      id: resp.data.data.User.id,
      username: resp.data.data.User.name,
      avurl: resp.data.data.User.avatar.medium
    };

      return this.userdata.id;
    } catch {

    }
  }

  async fetchUserById(id: number) {
    const q = `
    query ($id: Int) {
      User (id: $id) {
        id
        name
        avatar {
          medium
        }
      }
    }`;

    const vars = {
      id
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

    this.userdata = {
      id: resp.data.data.User.id,
      username: resp.data.data.User.name,
      avurl: resp.data.data.User.avatar.medium
    };

    return this.userdata;
  }
}
