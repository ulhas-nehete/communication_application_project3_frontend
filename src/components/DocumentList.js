import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_URL;
const DocumentList = () => {
    const [files, setFiles] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('add');
    const [currentFile, setCurrentFile] = useState({ id: '', label: '', filename: '' });
    const [fileToDelete, setFileToDelete] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Fetch files from API
        const fetchFiles = async () => {
            try {
                const response = await axios.get(`${apiUrl}/uploads`);
                setFiles(response.data);
            } catch (error) {
                console.error('Error fetching files:', error);
            }
        };

        fetchFiles();
    }, []);

    // Open modal
    const handleOpenModal = (type, file = { id: '', label: '', filename: '' }) => {
        setModalType(type);
        setCurrentFile(file);
        setShowModal(true);
        setMessage('');
    };

    // Close modal
    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentFile({ id: '', label: '', filename: '' });
    };

    // Save file
    const handleSaveFile = async () => {
        // Label validation
        if (currentFile.label === '') {
            setMessage('Please enter file description');
            return;
        }

        // File name validation
        if (currentFile.filename === '') {
            setMessage('Please add file');
            return;
        }

        try {
            if (modalType === 'add') {
                // Add file
                const response = await axios.post(`${apiUrl}/uploads`, currentFile);
                setFiles([...files, response.data]);
            } else if (modalType === 'edit') {
                // Update file
                const response = await axios.put(`${apiUrl}/uploads/${currentFile.id}`, currentFile);
                setFiles(files.map(file => (file.id === currentFile.id ? response.data : file)));
            }
            handleCloseModal();
        } catch (error) {
            console.error('Error saving file:', error);
        }
    };

    // Delete file
    const handleDeleteFile = async () => {
        try {
            await axios.delete(`${apiUrl}/uploads/${fileToDelete}`);
            setFiles(files.filter(file => file.id !== fileToDelete));
            setFileToDelete(null);
            handleCloseModal();
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    };

    // Handle file input
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setCurrentFile(prev => ({
                ...prev,
                filename: file.name
            }));
        }
    };

    return (
        <>
            <h1 className="pageHeader">My Uploads</h1>
            <table className="table table-striped table-hover table-bordered">
                <thead>
                    <tr>
                        <th width="40%">Label</th>
                        <th className="text-center">File Name</th>
                        <th width="20%" className="text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {files.length > 0 ? (
                        files.map(file => (
                            <tr key={file.id}>
                                <td>{file.label}</td>
                                <td className="text-center">{file.filename}</td>
                                <td className="text-center">
                                    <Button variant="link" onClick={() => handleOpenModal('edit', file)}>Edit</Button>
                                    <span className="divider"> | </span>
                                    <Button variant="link" onClick={() => { setFileToDelete(file.id); handleOpenModal('delete'); }}>Delete</Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={3} className='text-center'>No data found</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Modal */}
            <Modal show={showModal} onHide={handleCloseModal} backdrop="static" keyboard={false} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{modalType === 'add' ? 'Upload' : modalType === 'edit' ? 'Edit' : 'Confirm File Deletion'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modalType === 'delete' ? (
                        <div className="text-center">
                            <strong className="d-block p-3 mb-3">Are you sure?</strong>
                            <Button variant="default" className="me-2" onClick={handleDeleteFile}>Ok</Button>
                            <Button variant="default" onClick={handleCloseModal}>Cancel</Button>
                        </div>
                    ) : (
                        <Form>
                            <Form.Group controlId="formFileLabel" className="mb-3">
                                <Form.Label>File Description</Form.Label>
                                <Form.Control type="text" value={currentFile.label} onChange={(e) => setCurrentFile({ ...currentFile, label: e.target.value })} />
                            </Form.Group>
                            <Form.Group controlId="formFileUpload">                                
                                {modalType === 'add' ? (
                                    <><Form.Label>File Upload</Form.Label><Form.Control type="file" onChange={handleFileChange} /></>
                                ) : (
                                    <Form.Control className='d-none' type="text" value={currentFile.filename} onChange={(e) => setCurrentFile({ ...currentFile, filename: e.target.value })} />
                                )}
                            </Form.Group>

                            <div className="mt-3">
                                <div className="mb-2">{message && <span className="error">{message}</span>}</div>
                                <Button variant="default" className="me-2" onClick={handleSaveFile}>
                                    {modalType === 'add' ? 'Upload Now' : 'Save'}
                                </Button>
                                <Button variant="default" onClick={handleCloseModal}>Cancel</Button>
                            </div>
                        </Form>
                    )}
                </Modal.Body>
            </Modal>

            <Button variant="default" onClick={() => handleOpenModal('add')}>+ Add Upload</Button>
        </>
    );
};

export default DocumentList;
