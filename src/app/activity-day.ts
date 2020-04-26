export interface ActivityDay {
    day: ActivityDate,
    eps: number,
    anime?: ActivityMedia[]
}

export interface ActivityDate {
    date: number,
    month: number,
    year: number,
    weekday: string,
    time: number
  }
  
export interface ActivityMedia {
    id: number,
    title: string,
    image: string,
    eps: number
}

export const fetchQuery = `
    query ($userId: Int, $page: Int, $perPage: Int) {
      Page (page: $page, perPage: $perPage) {
        pageInfo {
          total
          currentPage
          lastPage
          hasNextPage
          perPage
        }
        activities (userId: $userId, sort: ID_DESC) {
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
    }`

export const daysStrings = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
export function activityDateFromDate(timestamp: Date): ActivityDate {
  let date = timestamp.getDate(),
      month = timestamp.getMonth()+1,
      year = timestamp.getFullYear(),
      weekday = daysStrings[timestamp.getDay()],
      eps = 0;
  
      return {
        date, // 01
        month, // April
        year, // 2020
        weekday, // Wednesday
        time: timestamp.getTime()
      }
}

export function dateFromActivityDate(activityDate: ActivityDate): Date {
  return new Date(activityDate.time);
}