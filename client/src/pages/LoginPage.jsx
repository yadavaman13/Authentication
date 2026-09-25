import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { loading, handleLogin } = useAuth();

    if (loading) {
        return <h1>Loading......</h1>;
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        await handleLogin({ email, password });
        console.log('Logged In Successfully');
    }

    return (
        <main>
            <div className="">
                <form
                    onSubmit={(e) => {
                        handleFormSubmit(e);
                    }}
                >
                    <input
                        onInput={(e) => setEmail(e.target.value)}
                        value={email}
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Enter your email"
                        required
                    />

                    <input
                        onInput={(e) => setPassword(e.target.value)}
                        value={password}
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Enter your password"
                        required
                    />

                    <button type="submit">Sign In</button>

                    <h3>
                        Dont have an account? <Link to="/register">Sign up</Link>{' '}
                    </h3>
                </form>
            </div>
        </main>
    );
};

export default LoginPage;
