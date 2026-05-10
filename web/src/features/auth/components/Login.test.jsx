import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';

test('renders login form', () => {
render(
    <BrowserRouter>
<Login />
    </BrowserRouter>
);

expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
});