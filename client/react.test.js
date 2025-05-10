import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import Banner from './src/components/layout/Banner.js';

const foo = () => { };

test('is disabled when user is a guest (no clientInfo)', () => {
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

test('is enabled when user is logged in (has clientInfo)', () => {
    render(
        <Banner
            display={''}
            clientInfo={{ displayName: 'Bote' }}
            setDisplay={foo}
            setQuery={foo}
            setClientInfo={foo}
            setFlash={foo}
        />
    );

    const createPostButton = screen.getByRole('button', { name: /create post/i });
    expect(createPostButton).toBeEnabled();
});
