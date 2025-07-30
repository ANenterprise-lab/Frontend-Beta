// anenterprise-lab/frontend/frontend-a129faec840f2542d190aa038be051711b19e5fa/src/pages/admin/ProductEditPage.jsx
import { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../axiosConfig'; // Adjust path for nested folder

function ProductEditPage() {
    const { id: productId } = useParams(); // Get product ID from URL
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [sku, setSku] = useState('');
    const [barcode, setBarcode] = useState('');
    const [category, setCategory] = useState('');
    const [variety, setVariety] = useState('');
    const [price, setPrice] = useState(0);
    const [stockLevel, setStockLevel] = useState(0);
    const [imageUrl, setImageUrl] = useState('');
    const [description, setDescription] = useState('');
    const [uploading, setUploading] = useState(false); // ADDED: State for upload status

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // NEW: Handler for file upload (similar to ProductAddPage)
    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file); 
        setUploading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data', 
                },
            };
            const { data } = await api.post('/api/upload', formData, config); 
            setImageUrl(data.imageUrl); 
            setUploading(false);
            alert('Image uploaded successfully!');
        } catch (error) {
            console.error("Error uploading image:", error);
            setUploading(false);
            alert('Failed to upload image. Please try again.');
        }
    };

    // Effect to load product data when component mounts or productId changes
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                if (!userInfo || !userInfo.isAdmin) {
                    alert('Not authorized as an admin.');
                    navigate('/login'); 
                    return;
                }

                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };

                const { data } = await api.get(`/api/products/${productId}`, config);

                setName(data.name);
                setSku(data.sku);
                setBarcode(data.barcode);
                setCategory(data.category);
                setVariety(data.variety);
                setPrice(data.price);
                setStockLevel(data.stockLevel);
                setImageUrl(data.imageUrl);
                setDescription(data.description);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching product for edit:", err);
                setError(err.response?.data?.message || 'Failed to load product for editing.');
                setLoading(false);
                alert('Failed to load product. Check console for details.');
                navigate('/admin/products'); 
            }
        };

        if (productId) {
            fetchProduct();
        } else {
            setError('No product ID provided.');
            setLoading(false);
            navigate('/admin/products');
        }
    }, [productId, navigate]); 

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const updatedProduct = {
                name, sku, barcode, category, variety, price, stockLevel, imageUrl, description
            };
            await api.put(`/api/products/${productId}`, updatedProduct, config);

            alert('Product updated successfully!');
            setLoading(false);
            navigate('/admin/products'); 
        } catch (err) {
            console.error("Error updating product:", err);
            alert(err.response?.data?.message || 'Failed to update product.');
            setError(err.response?.data?.message || 'Failed to update product.');
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Edit Product</h1>
            {loading ? (
                <p>Loading product...</p>
            ) : error ? (
                <p className="text-danger">{error}</p>
            ) : (
                <Form onSubmit={submitHandler}>
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
                                {/* ADDED: File Upload Input */}
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

                    <Button type='submit' variant='primary' className='my-3' disabled={uploading}>
                        Update Product
                    </Button>
                </Form>
            )}
        </div>
    );
}

export default ProductEditPage;