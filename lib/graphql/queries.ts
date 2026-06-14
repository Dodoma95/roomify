export const BOOKINGS_ADMIN_QUERY = `
  query AdminBookings($filter: BookingFilterInput, $pagination: PageInfoInput) {
    bookings(filter: $filter, pagination: $pagination) {
      results {
        id
        startDate
        endDate
        status
        totalPrice
        notes
        createdAt
        place {
          id
          name
          address
          type
          status
          pricePerHour
          owner {
            id
            firstName
            lastName
            email
          }
        }
        booker {
          id
          firstName
          lastName
          email
        }
      }
      pageInfo {
        page
        pageSize
        totalElements
        totalPages
        hasNext
        hasPrevious
      }
    }
  }
`;

export const USERS_ADMIN_QUERY = `
  query AdminUsers($filter: UserFilterInput, $pagination: PageInfoInput) {
    users(filter: $filter, pagination: $pagination) {
      results {
        id
        email
        firstName
        lastName
        roles
        enabled
        emailVerified
        deletedAt
        deletedBy
      }
      pageInfo {
        page
        pageSize
        totalElements
        totalPages
        hasNext
        hasPrevious
      }
    }
  }
`;

export const PLACE_QUERY = `
  query Place($id: ID!) {
    place(id: $id) {
      id
      name
      description
      type
      status
      capacity
      pricePerHour
      address
      owner {
        id
        firstName
        lastName
        email
      }
    }
  }
`;

export const PLACES_QUERY = `
  query Places($filter: PlaceFilterInput, $pagination: PageInfoInput) {
    places(filter: $filter, pagination: $pagination) {
      results {
        id
        name
        description
        type
        status
        capacity
        pricePerHour
        address
        owner {
          id
          firstName
          lastName
          email
        }
      }
      pageInfo {
        page
        pageSize
        totalElements
        totalPages
        hasNext
        hasPrevious
      }
    }
  }
`;
