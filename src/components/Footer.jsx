// src/components/Footer.jsx
import { Container, Row, Col } from 'react-bootstrap';
import './Footer.css';

const Footer = ({ theme }) => {
  return (
    <footer>
      <Container>
        <Row>
          <Col className="text-center py-3">
            {/* ADDED: "From the Maker" handwritten note */}
            <div className="maker-note">
              <p>From the Maker,</p>
              <span>With love and wagging tails.</span>
            </div>

            {theme === 'theme-night' && (
              <p className="whisper-affirmation">
                Hope your furry friend is curled up nearby.
              </p>
            )}
            Copyright &copy; Your Pet Food Brand
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;