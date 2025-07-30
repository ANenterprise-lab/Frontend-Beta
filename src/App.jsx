// src/App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { AnimatePresence } from 'framer-motion';

// Import Pages and Components
import HomePage from './pages/HomePage';
import StorePage from './pages/StorePage';
import AboutUsPage from './pages/AboutUsPage';
import AdminPage from './pages/AdminPage';
import ProcessingPage from './pages/ProcessingPage';
import StockPage from './pages/StockPage';
import B2BPage from './pages/B2BPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import MyOrdersPage from './pages/MyOrdersPage';
import './App.css';
import Footer from './components/Footer.jsx';
import ProductAddPage from './pages/admin/ProductAddPage';
import ProductListPage from './pages/admin/ProductListPage';
import ProductEditPage from './pages/admin/ProductEditPage';
import UserListPage from './pages/admin/UserListPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import MyPetsPage from './pages/MyPetsPage';
import AnimatedPage from './components/AnimatedPage';
import AmbientPlayer from './components/AmbientPlayer';
import RewardsPage from './pages/RewardsPage'; // Import the new RewardsPage
import MemoryWallPage from './pages/MemoryWallPage';

// Helper function to get the theme based on the time of day
const getTimeOfDayTheme = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'theme-morning';
    if (hour >= 12 && hour < 18) return 'theme-afternoon';
    if (hour >= 18 && hour < 22) return 'theme-evening';
    return 'theme-night';
};

// This component wraps the Routes to enable animation
function AppRoutes({ cart, addToCart, removeFromCart, setCart }) {
    const location = useLocation();
    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<AnimatedPage><HomePage /></AnimatedPage>} />
                <Route path="/store" element={<AnimatedPage><StorePage cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} /></AnimatedPage>} />
                <Route path="/product/:id" element={<AnimatedPage><ProductDetailPage addToCart={addToCart} /></AnimatedPage>} />
                <Route path="/about" element={<AnimatedPage><AboutUsPage /></AnimatedPage>} />
                <Route path="/checkout" element={<AnimatedPage><CheckoutPage cart={cart} setCart={setCart} removeFromCart={removeFromCart} /></AnimatedPage>} />
                <Route path="/b2b" element={<AnimatedPage><B2BPage /></AnimatedPage>} />
                <Route path="/register" element={<AnimatedPage><RegisterPage /></AnimatedPage>} />
                <Route path="/login" element={<AnimatedPage><LoginPage /></AnimatedPage>} />
                <Route path="/myorders" element={<AnimatedPage><MyOrdersPage /></AnimatedPage>} />
                <Route path="/mypets" element={<AnimatedPage><MyPetsPage /></AnimatedPage>} />
                <Route path="/rewards" element={<AnimatedPage><RewardsPage /></AnimatedPage>} /> {/* ADDED: Route for the Rewards Page */}
                <Route path="/memory-wall" element={<AnimatedPage><MemoryWallPage /></AnimatedPage>} /> {/* ADD THIS */}
                <Route path="/myorders/:id" element={<AnimatedPage><OrderDetailsPage /></AnimatedPage>} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/processing" element={<ProcessingPage />} />
                <Route path="/stock" element={<StockPage />} />
                <Route path="/admin/product/add" element={<ProductAddPage />} />
                <Route path="/admin/products" element={<ProductListPage />} />
                <Route path="/admin/products/:id/edit" element={<ProductEditPage />} />
                <Route path="/admin/users" element={<UserListPage />} />
            </Routes>
        </AnimatePresence>
    );
}

function App() {
    const [userInfo, setUserInfo] = useState(null);
    const [cart, setCart] = useState([]);
    const [cartAnimation, setCartAnimation] = useState('');
    const [theme, setTheme] = useState('theme-night');

    useEffect(() => {
        setTheme(getTimeOfDayTheme());
    }, []);

    const addToCart = (product, customNote = '') => {
        setCart(prevCart => {
            if (!prevCart.find(item => item.product._id === product._id)) {
                setCartAnimation('cart-thump');
                setTimeout(() => setCartAnimation(''), 500);
                return [...prevCart, { product, customNote }];
            }
            return prevCart;
        });
    };

    const removeFromCart = (productToRemove) => {
        setCart(cart.filter(item => item.product._id !== productToRemove._id));
    };

    useEffect(() => {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) setUserInfo(JSON.parse(storedUserInfo));
    }, []);

    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        setUserInfo(null);
        window.location.href = '/login';
    };

    return (
        <div className={`app-wrapper ${theme}`}>
            <Router>
                <AmbientPlayer isNight={theme === 'theme-night'} />
                <header>
                    <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
                        <Container fluid>
                            <LinkContainer to="/">
                                <Navbar.Brand>Pet Food Brand</Navbar.Brand>
                            </LinkContainer>
                            <Navbar.Toggle aria-controls="basic-navbar-nav" />
                            <Navbar.Collapse id="basic-navbar-nav">
                                <Nav className="ms-auto">
                                    <LinkContainer to="/store">
                                        <Nav.Link className={cartAnimation}>
                                            Store {cart.length > 0 && `(${cart.length})`}
                                        </Nav.Link>
                                    </LinkContainer>
                                    <LinkContainer to="/about"><Nav.Link>About</Nav.Link></LinkContainer>
                                    <LinkContainer to="/memory-wall"><Nav.Link>Memory Wall</Nav.Link></LinkContainer>
                                    <LinkContainer to="/b2b"><Nav.Link>B2B</Nav.Link></LinkContainer>
                                    {userInfo ? (
                                        <NavDropdown title={userInfo.name} id="username">
                                            <LinkContainer to="/myorders"><NavDropdown.Item>My Orders</NavDropdown.Item></LinkContainer>
                                            <LinkContainer to="/mypets"><NavDropdown.Item>My Pets</NavDropdown.Item></LinkContainer>
                                            <LinkContainer to="/rewards"><NavDropdown.Item>My Rewards</NavDropdown.Item></LinkContainer> {/* ADDED: Link in the dropdown */}
                                            <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                                        </NavDropdown>
                                    ) : (
                                        <>
                                        <LinkContainer to="/login"><Nav.Link>Login</Nav.Link></LinkContainer>
                                        <LinkContainer to="/register"><Nav.Link>Register</Nav.Link></LinkContainer>
                                        </>
                                    )}
                                    {userInfo && userInfo.isAdmin && (
                                         <NavDropdown title="Admin Panel" id="adminmenu">
                                            <LinkContainer to="/admin"><NavDropdown.Item>Pending Orders</NavDropdown.Item></LinkContainer>
                                            <LinkContainer to="/processing"><NavDropdown.Item>Process Orders</NavDropdown.Item></LinkContainer>
                                            <LinkContainer to="/stock"><NavDropdown.Item>Manage Stock</NavDropdown.Item></LinkContainer>
                                            <NavDropdown.Divider />
                                            <LinkContainer to="/admin/product/add"><NavDropdown.Item>Add Product</NavDropdown.Item></LinkContainer>
                                            <LinkContainer to="/admin/products"><NavDropdown.Item>Manage Products</NavDropdown.Item></LinkContainer>
                                            <LinkContainer to="/admin/users"><NavDropdown.Item>Manage Users</NavDropdown.Item></LinkContainer>
                                    </NavDropdown>
                                    )}
                                </Nav>
                            </Navbar.Collapse>
                        </Container>
                    </Navbar>
                </header>
                <main className="py-3">
                    <Container fluid>
                        <AppRoutes
                            cart={cart}
                            addToCart={addToCart}
                            removeFromCart={removeFromCart}
                            setCart={setCart}
                        />
                    </Container>
                </main>
                <Footer theme={theme} />
            </Router>
        </div>
    );
}

export default App;