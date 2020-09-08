import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import moment from 'moment';
import './dashboard.css';
import { Button } from 'reactstrap';

// Dashboard willl show all events
export default function Dashboard() {
    const [events, setEvents] = useState([]);
    const user_id = localStorage.getItem('user');

    const getEvents = async (filter) => {
        const url = filter ? `/dashboard/${filter}` : '/dashboard';
        const response = await api.get(url, { headers: { user_id } });

        setEvents(response.data);
    };

    useEffect(() => {
        getEvents();
    }, [])

    console.log(events);
    return (
        <ul className="events-list">
            {events.map(event => (
                <li key={event._id}>
                    <header style={{ backgroundImage: `url(${event.thumbnail_url})` }} />
                    <strong>{event.title}</strong>
                    <span>Event date: {moment(event.date).format('LL')}</span>
                    <span>Event price: {parseFloat(event.price).toFixed(2)}</span>
                    <span>Event description: {event.description}</span>
                    <Button color="primary">Subscribe</Button>
                </li>
            ))}
        </ul>
    )
}