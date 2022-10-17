import { gql } from "@apollo/client";

export const SCHEDULE_NEW_MEETING = gql`
    mutation Meeting(
        $id: Int!
        $title: String!
        $date: String!
        $startTime: String!
        $endTime: String!
        $meetingRoomId: Int!
    ) {
        Meeting(
            id: $id
            title: $title 
            date: $date
            startTime: $startTime
            endTime: $endTime 
            meetingRoomId: $meetingRoomId
            ) {
            id
            }
    }
`;

/**
 * Meeting(
id: Int!
title: String!
date: String!
startTime: String!
endTime: String!
meetingRoomId: Int!
):
 */