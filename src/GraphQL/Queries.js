import {gql} from '@apollo/client';

export const FETCH_ALL_BUILDINGS = gql`
    query{
        Buildings {
            name
            meetingRooms {
                id
                name
                floor
                meetings {
                title
                date
                startTime
                endTime
                }
            }
        }
    }   
`;

export const FETCH_ALL_MEETING_ROOMS = gql`
query {
    MeetingRooms {
        name
        floor
        building {
            name
        }
        meetings {
        title
        date
        startTime
        endTime
        }
    }   
}
`;