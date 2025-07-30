import React from 'react';
import { Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './StoryCarousel.css'; // We'll create this next

// Sample stories and products
const stories = [
    {
        productName: 'Anxiety-Relief Chew Toy',
        story: '“This chew toy helped Max overcome his separation anxiety. Now, it’s his go-to comfort item whenever we leave the house.”',
        petName: 'Max, the Beagle',
        imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500',
        productId: '66a1e12932e54203239a5840' // Replace with a real product ID from your DB
    },
    {
        productName: 'Gentle Puppy Shampoo',
        story: '“Bella had sensitive skin and every shampoo we tried caused irritation. This gentle formula is the only thing that leaves her clean and happy!”',
        petName: 'Bella, the Golden Retriever',
        imageUrl: 'https://images.unsplash.com/photo-1598875706250-21fa36d3151f?w=500',
        productId: '66a1e12932e54203239a5840' // Replace with a real product ID
    },
    {
        productName: 'Organic Chicken Treats',
        story: '“As a senior cat, Whiskers is a picky eater. He absolutely adores these organic treats, and we love that they are healthy for him.”',
        petName: 'Whiskers, the Senior Cat',
        imageUrl: 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=500',
        productId: '66a1e12932e54203239a5840' // Replace with a real product ID
    }
];

function StoryCarousel() {
    return (
        <div className="story-carousel-container">
            <h1 className="text-center">Tales of Happy Tails</h1>
            <Carousel interval={8000} pause="hover">
                {stories.map((item, index) => (
                    <Carousel.Item key={index}>
                        <div className="carousel-story-item">
                            <img
                                className="story-image"
                                src={item.imageUrl}
                                alt={item.petName}
                            />
                            <div className="story-content">
                                <h2>{item.productName}</h2>
                                <blockquote className="story-text">
                                    {item.story}
                                </blockquote>
                                <cite>— {item.petName}</cite>
                                <Link to={`/product/${item.productId}`} className="btn btn-primary mt-3">
                                    View Product
                                </Link>
                            </div>
                        </div>
                    </Carousel.Item>
                ))}
            </Carousel>
        </div>
    );
}

export default StoryCarousel;