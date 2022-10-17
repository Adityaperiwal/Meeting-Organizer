import React, { useEffect, useState } from 'react'
import { useQuery, gql } from '@apollo/client';
import { FETCH_ALL_BUILDINGS, FETCH_ALL_MEETING_ROOMS } from '../../GraphQL/Queries';
import './MeetingsInfo.css';
import AddMeeting from '../AddAMeeting';
import { convertToDate } from '../../utils';
function MeetingsInfo() {
    const { data: buildingsInfo, refetch: refetchBuildings } = useQuery(FETCH_ALL_BUILDINGS);
    const { data: meetingRoomsInfo, refetch: refetchMeetings } = useQuery(FETCH_ALL_MEETING_ROOMS);

    const [buildings, setBuildings] = useState([]);
    const [meetingRooms, setMeetingRooms] = useState([]);
    const [addAMeeting, setAddAMeeting] = useState(false);
    const [stats, setStats] = useState({
        freeRoomsNowCount: 0,
        meetingsToday: 0,
        meetingsGoingOn: 0
    })

    useEffect(() => {
        console.log(buildingsInfo);
        if (buildingsInfo?.Buildings) {
            setBuildings(buildingsInfo.Buildings);
        }
    }, [buildingsInfo]);

    useEffect(() => {
        console.log(meetingRoomsInfo);
        if (meetingRoomsInfo?.MeetingRooms) {
            setMeetingRooms(meetingRoomsInfo.MeetingRooms);
            initializeStats(meetingRoomsInfo.MeetingRooms);
        }
    }, [meetingRoomsInfo]);

    const refetchInfo = ()=>{
        refetchBuildings();
        refetchMeetings();
    }

    const initializeStats = (meetingRoomStats) => {
        const currentDate = new Date(); // for now
        let freeRoomsNowCount = 0, meetingsGoingOn = 0;
        let meetingsToday = 0;
        meetingRoomStats.forEach(room => {
            let isOccupiedNow = false;
            room.meetings.forEach(meet => {
                convertToDate(meet.date, meet.endTime);
                const meetingStartDate = convertToDate(meet.date, meet.startTime);
                const meetingEndDate = convertToDate(meet.date, meet.endTime);
                console.log(meetingStartDate, meetingEndDate);
                if (meetingStartDate.getTime() < currentDate.getTime() && meetingEndDate.getTime() > currentDate.getTime()) {
                  isOccupiedNow = true;
                  meetingsGoingOn++;  
                }
                if (currentDate.toDateString() === meetingStartDate.toDateString()) {
                    meetingsToday++;
                }
            });
            if(!isOccupiedNow) {
                freeRoomsNowCount++;
            }
        });
        setStats({
            freeRoomsNowCount,
            meetingsToday,
            meetingsGoingOn
        });
        console.log(freeRoomsNowCount);
    }

    return (<>
        {!addAMeeting && <>
            <div className="main-heading">Smart Meeting Organizer</div>
            <div className="flex-column main-container">
            <div className="flex-column info-card">
                <div className="heading">Buildings</div>
                <div>Total: {buildings.length}</div>
            </div>
            <div className="flex-column info-card">
                <div className="heading">Rooms</div>
                <div>Total {meetingRooms.length}</div>
                <div>Free Now {stats.freeRoomsNowCount}</div>
            </div>
            <div className="flex-column info-card meetings-card">
                <div className="heading">Meetings</div>
                <div>Total {stats.meetingsToday} Today</div>
                <div>Total {stats.meetingsGoingOn} Going on now</div>
            </div>
            <div className="action-btn" onClick={() => { setAddAMeeting(true) }}>Add a Meeting</div>
        </div>
        </>
        }
        {addAMeeting && <AddMeeting buildings={buildings}  meetingRooms={meetingRooms} goToMeetingInfo={()=>{setAddAMeeting(false);refetchInfo();}} />}
    </>
    )
}

export default MeetingsInfo
