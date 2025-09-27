import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SubscriptionActions from '@/components/subscription/SubscriptionActions'; // Adjust the import path if necessary

describe('Delete Subscription Functionality', () => {
  it('calls the onDelete function when the "Delete Subscription" button is clicked', () => {
    const onUpdateMock = jest.fn(); // Mock the update function, not used in this test
    const onDeleteMock = jest.fn(); // Mock the delete function

    render(<SubscriptionActions onUpdate={onUpdateMock} onDelete={onDeleteMock} />);

    // Find and click the delete button
    const deleteButton = screen.getByText('Delete Subscription');
    fireEvent.click(deleteButton);

    // Assert that the delete function was called once
    expect(onDeleteMock).toHaveBeenCalledTimes(1);
    expect(onUpdateMock).not.toHaveBeenCalled(); // Ensure update wasn't accidentally called
  });
});
