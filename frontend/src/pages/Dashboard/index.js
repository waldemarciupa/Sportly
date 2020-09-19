import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import moment from 'moment';
import socketio from 'socket.io-client';
import './dashboard.css';
import { Button, ButtonGroup, Alert } from 'reactstrap';

// Dashboard willl show all events
export default function Dashboard({ history }) {
    const [events, setEvents] = useState([]);
    const [rSelected, setRSelected] = useState(null);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const user = localStorage.getItem('user');
    const user_id = localStorage.getItem('user_id');

    const getEvents = async (filter) => {
        try {
            const url = filter ? `/dashboard/${filter}` : '/dashboard';
            const response = await api.get(url, { headers: { user: user } });
            setEvents(response.data.events);
        } catch (error) {
            history.push('/login');
        }
    };

    const handleFilter = (query) => {
        setRSelected(query);
        getEvents(query);
    }

    const handleEventsByUserId = async () => {
        try {
            setRSelected('myevents');
            const response = await api.get('/user/events', { headers: { user: user } });

            setEvents(response.data.events);
        } catch (error) {
            history.push('/login');
        }

    }

    const handleDeleteEvent = async (eventId) => {

        try {
            const deleteEvent = await api.delete(`/event/${eventId}`, { headers: { user: user } })
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                handleFilter(null)
            }, 2000);

        } catch (error) {
            setError(true);
            setTimeout(() => {
                setError(false)
            }, 2000);
            console.log('Missing required data');
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('user_id');
        history.push('/login');
    }

    useEffect(() => {
        getEvents();
    }, [])

    useEffect(() => {
        const socket = socketio('http://localhost:8000/', { query: { user_id } })
    }, [])

    return (
        <>
            <div className="filter-panel">
                <ButtonGroup>
                    <Button
                        color="primary"
                        onClick={() => handleFilter(null)}
                        active={rSelected === null}>All</Button>
                    <Button
                        color="primary"
                        onClick={handleEventsByUserId}
                        active={rSelected === 'myevents'}>My events</Button>
                    <Button
                        color="primary"
                        onClick={() => handleFilter('running')}
                        active={rSelected === 'Running'}>Running</Button>
                    <Button
                        color="primary"
                        onClick={() => handleFilter('eSport')}
                        active={rSelected === 'eSport'}>eSport</Button>
                    <Button
                        color="primary"
                        onClick={() => handleFilter('Swimming')}
                        active={rSelected === 'Swimming'}>Swimming</Button>
                    <Button
                        color="primary"
                        onClick={() => handleFilter('Cycling')}
                        active={rSelected === 'Cycling'}>Cycling</Button>
                </ButtonGroup>
                <ButtonGroup>
                    <Button color="secondary" onClick={() => history.push('events')} >Add Event</Button>
                    <Button color="danger" onClick={handleLogout} >Logout</Button>
                </ButtonGroup>
            </div>
            <ul className="events-list">
                {events.map(event => (
                    <li key={event._id}>
                        <header style={{ backgroundImage: `url(${event.thumbnail_url})` }} >
                            {event.user === user_id ?
                                <div>
                                    <Button
                                        size="sm"
                                        color="danger"
                                        onClick={() => handleDeleteEvent(event._id)}
                                    >
                                        Delete
                                    </Button>
                                </div> : ''}
                        </header>
                        <strong>{event.title}</strong>
                        <span>Event date: {moment(event.date).format('LL')}</span>
                        <span>Event price: {parseFloat(event.price).toFixed(2)}</span>
                        <span>Event description: {event.description}</span>
                        <Button color="primary">Subscribe</Button>
                    </li>
                ))}
            </ul>
            {error ? (
                <Alert className="event-validation" color="danger">Erro when deleting event!</Alert>
            ) : ""}
            {success ? (
                <Alert className="event-validation" color="success">The event was deleted succesfully</Alert>
            ) : ""}
        </>
    )
}