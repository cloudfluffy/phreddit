import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Banner from './src/components/layout/Banner.js';

const foo = () => { };

test('create post button is disabled when user is a guest (clientInfo is null)', () => {
    render(
        <Banner
            display={''}
            clientInfo={null}
            setDisplay={foo}
            setQuery={foo}
            setClientInfo={foo}
            setFlash={foo}
        />
    );

    const createPostButton = screen.getByRole('button', { name: /create post/i });
    expect(createPostButton).toBeDisabled();
});


test('create post button is enabled when user is logged in (clientInfo is not null)', () => {
    const mockClientInfo = { username: 'bote' };

    render(
        <Banner
            display={''}
            clientInfo={mockClientInfo}
            setDisplay={foo}
            setQuery={foo}
            setClientInfo={foo}
            setFlash={foo}
        />
    );

    const createPostButton = screen.getByRole('button', { name: /create post/i });
    expect(createPostButton).toBeEnabled();
});
