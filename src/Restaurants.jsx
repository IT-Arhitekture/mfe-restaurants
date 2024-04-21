import React, { useState, useEffect } from 'react';

function Restaurants() {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [restaurants, setRestaurants] = useState(null);
    const [searchId, setSearchId] = useState('66241bd982e1d75aed8cbe75');
    const [newRestaurant, setNewRestaurant] = useState({
        name: '',
        address: '',
        delovniCas: ''
    });

    useEffect(() => {
        fetchRestaurants();
    }, []);

    async function fetchRestaurants() {
        const response = await fetch('http://127.0.0.1:5000/web/restaurant-management-service/restaurants');
        const data = await response.json();
        setRestaurants(data);
    }

    async function searchRestaurantById() {
        const response = await fetch(`http://127.0.0.1:5000/web/restaurant-management-service/restaurants/${searchId}`);
        const data = await response.json();
        setRestaurants(Array.isArray(data) ? data : [data]);
    }

    async function deleteRestaurantById(id) {
        const response = await fetch(`http://127.0.0.1:5000/web/restaurant-management-service/restaurants/${id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            fetchRestaurants();
        } else {
            console.error('Failed to delete restaurant:', response.statusText);
        }
    }

    async function createRestaurant() {
        const response = await fetch('http://127.0.0.1:5000/web/restaurant-management-service/restaurants', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newRestaurant)
        });
        if (response.ok) {
            fetchRestaurants();
        } else {
            console.error('Failed to create restaurant:', response.statusText);
        }
    }

    return (
        <div>
            <div className="search-field">
                <input type="text" value={searchId} onChange={e => setSearchId(e.target.value)} placeholder="Enter restaurant ID"/>
                <button onClick={searchRestaurantById}>Search</button>
            </div>
            {restaurants ? (
                <>
                    <table className="table-list-restaurants">
                        <thead>
                        <tr>
                            <th>ime restavracije</th>
                            <th>naslov restavracije</th>
                            <th>delovni cas restavracije</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {restaurants.map(restaurant => (
                            <tr key={restaurant.id}>
                                <td>{restaurant.name}</td>
                                <td>{restaurant.address}</td>
                                <td>{restaurant.delovniCas}</td>
                                <td>
                                    <button onClick={() => deleteRestaurantById(restaurant.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <div className="create-field">
                        <button onClick={() => setShowCreateForm(!showCreateForm)}>Create</button>
                        {showCreateForm && (
                            <div className="create-form">
                                <input type="text" value={newRestaurant.name} onChange={e => setNewRestaurant({...newRestaurant, name: e.target.value})} placeholder="Enter restaurant name"/>
                                <input type="text" value={newRestaurant.address} onChange={e => setNewRestaurant({...newRestaurant, address: e.target.value})} placeholder="Enter restaurant address"/>
                                <input type="text" value={newRestaurant.delovniCas} onChange={e => setNewRestaurant({...newRestaurant, delovniCas: e.target.value})} placeholder="Enter restaurant working hours"/>
                                <button onClick={createRestaurant}>Submit</button>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default Restaurants;