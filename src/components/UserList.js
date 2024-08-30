import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_URL;
const UserList = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [message, setMessage] = useState('');

  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser')) || {};

  // Fetch users from API
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${apiUrl}/users`);
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleEdit = (index) => {
    setEditingUser({ ...users[index], index });
    setShowEditModal(true);
    setMessage('');
  };

  const handleSaveEdit = async () => {
    if (!editingUser?.fullname) {
      setMessage('Full name is required');
      return;
    }
    if (!editingUser?.email) {
      setMessage('Please enter email');
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(editingUser.email)) {
      setMessage('Please enter a valid email');
      return;
    }

    try {
      const response = await axios.put(`${apiUrl}/users/${editingUser.id}`, editingUser);
      const updatedUser = response.data;
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        )
      );
      setEditingUser(null);
      fetchUsers();
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDelete = (index) => {
    setUserToDelete(index);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    const userId = users[userToDelete]?.id;

    try {
      await axios.delete(`${apiUrl}/users/${userId}`);
      setUsers((prevUsers) =>
        prevUsers.filter((_, i) => i !== userToDelete)
      );
      setUserToDelete(null);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <>
      <h1 className="pageHeader">Users</h1>
      <table id="userList" className="userList table table-striped table-hover table-bordered">
        <thead>
          <tr>
            <th width="40%">Name</th>
            <th className="text-center">User Email ID</th>
            <th width="20%"></th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.fullname}</td>
              <td className="text-center">{user.email}</td>
              <td className="text-center">
                <Button variant="link" onClick={() => handleEdit(users.findIndex(u => u.id === user.id))}>Edit</Button>
                <span className="divider"> | </span>
                <Button variant="link" onClick={() => handleDelete(users.findIndex(u => u.id === user.id))} disabled={user.email === loggedInUser.email}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} backdrop="static" keyboard={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit User Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingUser && (
            <Form>
              <Form.Group controlId="formFullname" className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  value={editingUser.fullname || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, fullname: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formEmail">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  value={editingUser.email || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  disabled={editingUser.email === loggedInUser.email}
                />
              </Form.Group>
            </Form>
          )}
          {message && <span className="error">{message}</span>}
          <div className="mt-3">
            <Button variant="default" onClick={handleSaveEdit}>Save</Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} backdrop="static" keyboard={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm User Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <strong className="d-block p-3 text-center">Are you sure?</strong>
          <div className="mt-3 text-center">
            <Button variant="default" className="me-2" onClick={confirmDelete}>Ok</Button>
            <Button variant="default" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default UserList;
