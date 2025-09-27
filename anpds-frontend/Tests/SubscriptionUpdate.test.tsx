import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SubscriptionActions from '@/components/subscription/SubscriptionActions'; // Adjust the import path if necessary

describe('Update Subscription Functionality', () => {
  it('calls the onUpdate function when the "Update Subscription" button is clicked', () => {
    const onUpdateMock = jest.fn(); // Mock the update function
    const onDeleteMock = jest.fn(); // Mock the delete function, not used in this test

    render(<SubscriptionActions onUpdate={onUpdateMock} onDelete={onDeleteMock} />);

    // Find and click the update button
    const updateButton = screen.getByText('Update Subscription');
    fireEvent.click(updateButton);

    // Assert that the update function was called once
    expect(onUpdateMock).toHaveBeenCalledTimes(1);
    expect(onDeleteMock).not.toHaveBeenCalled(); // Ensure delete wasn't accidentally called
  });
});
