import ProductDetails from './product-details';

// This would be a database fetch in a real app
const getProductById = (id: string) => {
    const product = {
        id,
        name: 'Premium Brake Pad Set',
        description: 'Our Premium Brake Pad Set is engineered for maximum stopping power and longevity. Featuring advanced ceramic compound, these pads provide excellent performance while minimizing brake dust and noise. Precision-engineered to OEM specifications for a perfect fit, they come with all necessary hardware for a complete installation. Improve your vehicle\'s braking performance with our premium brake pads, suitable for daily driving and more demanding conditions.',
        price: 79.99,
        originalPrice: 99.99,
        discount: 20,
        rating: 4.8,
        reviewCount: 124,
        images: [
            'https://images.pexels.com/photos/4489794/pexels-photo-4489794.jpeg',
            'https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg',
            'https://images.pexels.com/photos/6157052/pexels-photo-6157052.jpeg',
        ],
        stock: 23,
        sku: 'BP-PRO-1248',
        brand: 'BrakeMaster',
        categories: ['Brakes', 'Brake Pads', 'Performance Parts'],
        tags: ['ceramic', 'low-dust', 'quiet'],
        specifications: [
            {name: 'Material', value: 'Ceramic Composite'},
            {name: 'Position', value: 'Front'},
            {name: 'Warranty', value: '2 Years / 24,000 Miles'},
            {name: 'Includes', value: 'Hardware Kit, Shims'},
            {name: 'Noise Level', value: 'Low'},
        ],
        compatibility: [
            {make: 'Honda', models: ['Accord (2018-2022)', 'Civic (2016-2022)']},
            {make: 'Toyota', models: ['Camry (2018-2022)', 'Corolla (2019-2022)']},
            {make: 'Ford', models: ['Fusion (2017-2020)', 'Focus (2016-2018)']},
        ],
    };

    return product;
};

// Mock product IDs for static generation
export function generateStaticParams() {
    // In a real app, this would fetch all product IDs from your database
    return ['1', '2', '3', '4', '5', '6', '7', '8'].map((id) => ({
        id: id,
    }));
}

export default function ProductPage({params}: { params: { id: string } }) {
    const product = getProductById(params.id);

    if (!product) {
        return null;
    }

    return <ProductDetails product={product}/>;
}