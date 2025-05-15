import React from 'react';
import Navbar from '../components/navbar';

const Home = () => {
    return (
        <>
            <Navbar />
            <section style={{ padding: '4rem 0', textAlign: 'center' }}>
                <h1>Bienvenido a Exami</h1>
                <p>Tu plataforma para exámenes y aprendizaje en línea.</p>
            </section>
        </>
    );
};

export default Home;