export const listQuery = 
`query ($id: Int, $chunk: Int) {
    MediaListCollection (userId: $id, type: ANIME, chunk: $chunk) {
      lists {
        name
        isCustomList
        entries {
          id
          status
          progress
          createdAt
          startedAt {
            year
            month
            day
          }
          completedAt {
            year
            month
            day
          }
          media {
            id
            coverImage {
              medium
            }
            bannerImage
            title {
              romaji
            }
            format
          }
        }
      }
    }
  }`

export const mediaQuery = 
`query($id: Int, $mediaId: Int, $page: Int, $perPage: Int) {
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
  `