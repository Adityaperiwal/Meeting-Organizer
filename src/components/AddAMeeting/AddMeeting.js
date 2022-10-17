import React, { useState } from 'react'
import MeetingRoomSelection from '../MeetingRoomSelection';
import './AddMeeting.css';

function AddMeeting({ buildings, meetingRooms, goToMeetingInfo }) {
    const initialState = {
        title: "",
        date: "",
        startTime: "",
        endTime: "",
        building: buildings[0] || "",
        room: ""
    }
    const [meetingInfo, setMeetingInfo] = useState(initialState);
    const [meetingRoomSelection, setMeetingRoomSelection] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(meetingInfo);
        setMeetingRoomSelection(true);
    }

    return (<>
        {!meetingRoomSelection && <div>
            <button className="back-btn" onClick={goToMeetingInfo}>Go Back</button>
            <form onSubmit={handleSubmit}>
            <div className="flex-column add-meeting-section">
                <div className="center-heading">Add Meeting</div>
                <div className="flex-row space-between input-section">
                    <div>Title</div>
                    <input required className="long-input" value={meetingInfo.title} onChange={(e) => setMeetingInfo({ ...meetingInfo, title: e.target.value })} type="text" />
                </div>
                <div className="flex-row space-between input-section">
                    <div>Date</div>
                    <input required className="long-input" value={meetingInfo.date} onChange={(e) => setMeetingInfo({ ...meetingInfo, date: e.target.value })} type="date" />
                </div>
                <div className="flex-row gap-small input-section">
                    <div className="time-label">Start Time:</div>
                    <input required className="time-input" type="time" value={meetingInfo.startTime} onChange={(e) => setMeetingInfo({ ...meetingInfo, startTime: e.target.value })} />
                </div>
                <div className="flex-row gap-small input-section">
                    <div className="time-label">End Time:</div>
                    <input required className="time-input" type="time" min={meetingInfo.startTime + ":00"} value={meetingInfo.endTime} onChange={(e) => setMeetingInfo({ ...meetingInfo, endTime: e.target.value })} />
                </div>
                <div className="flex-row gap-xs input-section">
                    <div className="building-label">Select Building</div>
                    <select onChange={(e) => {setMeetingInfo({ ...meetingInfo, building: buildings[e.target.value] });console.log('change', e.target.value)}}>
                        {buildings.map((building, index) => <option value={index}>{building.name}</option>)}
                    </select>
                </div>
                <input className="action-btn" type="submit" value="Next" />
            </div>
        </form>
        </div>
        }
        {meetingRoomSelection && <MeetingRoomSelection meetingInfo={meetingInfo} buildings={buildings} meetingRooms={meetingRooms} onBack={()=>{setMeetingRoomSelection(false)}} goToMeetingInfo={goToMeetingInfo}  />}
    </>)
}

export default AddMeeting;
