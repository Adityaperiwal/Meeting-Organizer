import { useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { SCHEDULE_NEW_MEETING } from '../../GraphQL/Mutations';
import { convertToDate } from '../../utils';
import './MeetingRoomSelection.css';

function MeetingRoomSelection({ meetingInfo, buildings, meetingRooms, onBack, goToMeetingInfo }) {

    const [meeting, setMeeting] = useState({});
    const [availableRooms, setAvailableRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(-1);
    const [scheduleMeeting, { data, error }] = useMutation(SCHEDULE_NEW_MEETING);
    const formatDateInput = (unformattedDate) => {
        const dateParts = unformattedDate.split('-');
        return dateParts[2] + '/' + dateParts[1] + '/' + dateParts[0];
    }

    const isOverLappingTime = (scheduledStart, scheduledEnd, selectedStart, selectedEnd) => {
        return !((scheduledStart.getTime() < selectedStart.getTime() && scheduledEnd.getTime() <= selectedStart.getTime()) ||
            (scheduledStart.getTime() > selectedEnd.getTime() && scheduledEnd.getTime() >= selectedEnd.getTime()));
    }

    const hasConflicts = (scheduledMeeting) => {
        const scheduledStart = convertToDate(scheduledMeeting.date, scheduledMeeting.startTime);
        const scheduledEnd = convertToDate(scheduledMeeting.date, scheduledMeeting.endTime);
        const selectedDate = formatDateInput(meetingInfo.date);
        const selectedStart = convertToDate(selectedDate, meetingInfo.startTime);
        const selectedEnd = convertToDate(selectedDate, meetingInfo.endTime);
        console.log(scheduledStart, scheduledEnd);
        console.log(selectedStart, selectedEnd);
        console.log(isOverLappingTime(scheduledStart, scheduledEnd, selectedStart, selectedEnd));
        return isOverLappingTime(scheduledStart, scheduledEnd, selectedStart, selectedEnd);
    }

    const initializeRooms = () => {
        console.log(meetingInfo)
        const { building: selectedBuilding } = meetingInfo;
        console.log('init')
        const availableMeetingRooms = selectedBuilding.meetingRooms.filter(meetingRoom => {
            console.log(meetingRoom)
            const hasConflictingMeeting = meetingRoom.meetings.some(scheduledMeeting => hasConflicts(scheduledMeeting));
            console.log(hasConflictingMeeting)
            return !hasConflictingMeeting;
        });
        console.log(availableMeetingRooms);
        setAvailableRooms(availableMeetingRooms);
    }

    const generateRandomId = () => Math.floor(Math.random() * 1000000000);

    const onMeetingSaveHandler = async () => {
        const meetingDetails = { ...meetingInfo, id: generateRandomId(), date: formatDateInput(meetingInfo.date), meetingRoomId: selectedRoom };
        try {
            await scheduleMeeting({
                variables: {
                    ...meetingDetails
                }
            });
            alert('Meeting scheduled successfully');
            goToMeetingInfo();
        } catch (error) {
            alert("There was an error while creating the meeting");
        }
    }

    useEffect(() => {
        initializeRooms();
    }, [])
    return (<div>
        <button className="back-btn" onClick={onBack}>Go Back</button>
        <div class="flex-column select-room-section space-between">
            <div>
                <div className="section-heading">Please Select one of the free rooms</div>
                <div class="room-options-section">
                    {availableRooms.map((room) =>
                        <div className={`flex-column room-card ${selectedRoom === room.id ? 'selected' : ''}`} onClick={() => setSelectedRoom(room.id)}>
                            <div className="room-name">{room.name}</div>
                            <div>{meetingInfo.building.name}</div>
                            <div>Floor {room.floor}</div>
                        </div>
                    )}
                    {!availableRooms.length && <div className="sorry-msg">Hmmm.. looks like there aren't any Rooms available for the chosen time in the selected building. No worries, you can choose a different time or building and try again</div>}
                </div>
            </div>
            <button className="action-btn" onClick={onMeetingSaveHandler} disabled={selectedRoom === -1}>Save</button>
        </div>
    </div>
    )
}

export default MeetingRoomSelection
