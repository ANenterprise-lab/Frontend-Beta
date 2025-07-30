// anenterprise-lab/frontend/frontend-a129faec840f2542d190aa038be051711b19e5fa/src/pages/admin/ProductAddPage.jsx
import { useState } from 'react';
import { Form, Button, Row, Col, Alert, Spinner, Card } from 'react-bootstrap'; // ADDED: Card
import { useNavigate } from 'react-router-dom';
import api from '../../axiosConfig'; 

function ProductAddPage() {
    const [name, setName] = useState('');
    const [sku, setSku] = useState('');
    const [barcode, setBarcode] = useState('');
    const [category, setCategory] = useState('');
    const [variety, setVariety] = useState('');
    const [price, setPrice] = useState(0);
    const [stockLevel, setStockLevel] = useState(0);
    const [imageUrl, setImageUrl] = useState('');
    const [description, setDescription] = useState('');
    const [uploading, setUploading] = useState(false); 
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(null); 
    const [message, setMessage] = useState(null); 
    const navigate = useNavigate();

    // Handler for file upload
    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file); 
        setUploading(true);
        setError(null); 
        setMessage(null); 

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data', 
                },
            };
            const { data } = await api.post('/api/upload', formData, config); 
            setImageUrl(data.imageUrl); 
            setUploading(false);
            setMessage('Image uploaded successfully!'); 
        } catch (uploadError) { 
            console.error("Error uploading image:", uploadError);
            setUploading(false);
            setError(uploadError.response?.data?.message || 'Failed to upload image. Please try again.'); 
        }
    };

    const addProductHandler = async (e) => {
        e.preventDefault();
        setLoading(true); 
        setError(null); 
        setMessage(null); 

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            await api.post(
                '/api/products',
                { name, sku, barcode, category, variety, price, stockLevel, imageUrl, description },
                config
            );

            setMessage('Product created successfully!'); 
            setLoading(false);
            // Optionally, clear form fields after success
            setName(''); setSku(''); setBarcode(''); setCategory(''); setVariety('');
            setPrice(0); setStockLevel(0); setImageUrl(''); setDescription('');
            // navigate('/admin/products'); // You might want to redirect after a delay, or keep them on the page
        } catch (submitError) { 
            setError(submitError.response?.data?.message || 'Failed to create product.'); 
            setLoading(false);
        }
    };

    return (
        // ADDED: Row and Col for centering, Card with glass-card class
        <Row className="justify-content-md-center mt-5">
            <Col xs={12} md={8} lg={6}> {/* Adjusted column sizes for product add form */}
                <Card className='p-4 glass-card'> {/* Added .glass-card class */}
                    <Card.Body>
                        <h1 className='text-center mb-4'>Add New Product</h1>
                        {error && <Alert variant='danger'>{error}</Alert>} 
                        {message && <Alert variant='success'>{message}</Alert>} 
                        {loading && <Spinner animation="border" role="status" className='d-block mx-auto mb-3'><span className="visually-hidden">Loading...</span></Spinner>} 

                        <Form onSubmit={addProductHandler}>
                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId='name' className='my-2'>
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control type='text' placeholder='Enter product name' value={name} onChange={(e) => setName(e.target.value)} required />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId='price' className='my-2'>
                                        <Form.Label>Price</Form.Label>
                                        <Form.Control type='number' placeholder='Enter price' value={price} onChange={(e) => setPrice(e.target.value)} required />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId='sku' className='my-2'>
                                        <Form.Label>SKU (Custom ID)</Form.Label>
                                        <Form.Control type='text' placeholder='e.g., 20200000' value={sku} onChange={(e) => setSku(e.target.value)} required />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId='barcode' className='my-2'>
                                        <Form.Label>Barcode</Form.Label>
                                        <Form.Control type='text' placeholder='Enter barcode' value={barcode} onChange={(e) => setBarcode(e.target.value)} required />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId='category' className='my-2'>
                                        <Form.Label>Category</Form.Label>
                                        <Form.Control type='text' placeholder='e.g., Dogs' value={category} onChange={(e) => setCategory(e.target.value)} required />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId='variety' className='my-2'>
                                        <Form.Label>Variety</Form.Label>
                                        <Form.Control type='text' placeholder='e.g., Puppy' value={variety} onChange={(e) => setVariety(e.target.value)} required />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId='stockLevel' className='my-2'>
                                        <Form.Label>Stock Level</Form.Label>
                                        <Form.Control type='number' placeholder='Enter stock level' value={stockLevel} onChange={(e) => setStockLevel(e.target.value)} required />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId='imageUrl' className='my-2'>
                                        <Form.Label>Image URL</Form.Label>
                                        <Form.Control 
                                            type='text' 
                                            placeholder='Enter image URL' 
                                            value={imageUrl} 
                                            onChange={(e) => setImageUrl(e.target.value)} 
                                        />
                                        <Form.Control 
                                            type='file' 
                                            className='mt-2' 
                                            onChange={uploadFileHandler} 
                                        />
                                        {uploading && <p>Uploading image...</p>}
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group controlId='description' className='my-2'>
                                <Form.Label>Description</Form.Label>
                                <Form.Control as='textarea' rows={3} placeholder='Enter description' value={description} onChange={(e) => setDescription(e.target.value)} required />
                            </Form.Group>

                            <Button type='submit' variant='primary' className='my-3' disabled={loading || uploading}> 
                                Create Product
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
}

export default ProductAddPage;