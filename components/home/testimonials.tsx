import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

const testimonials = [
  {
    id: 1,
    name: 'Michael Rodriguez',
    role: 'Car Enthusiast',
    content: 'Ive been buying parts for my project car from AutoParts for years. Their quality and customer service are unmatched. The fitment is always perfect!',
    avatar: 'https://images.pexels.com/photos/846741/pexels-photo-846741.jpeg',
    rating: 5
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    role: 'DIY Mechanic',
    content: 'Fast shipping and the parts are always as described. The vehicle search feature makes finding compatible parts so much easier. Highly recommend!',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
    rating: 5
  },
  {
    id: 3,
    name: 'David Williams',
    role: 'Professional Mechanic',
    content: 'As a mechanic, I need reliable parts delivered quickly. AutoParts has never let me down. Their catalogue is extensive and the quality is consistently good.',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    rating: 4
  }
];

export default function Testimonials() {
  return (
    <section className="py-12">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">What Our Customers Say</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Trusted by thousands of car enthusiasts, DIYers, and professional mechanics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="border-none shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>

              <div className="text-amber-500 mb-3">
                {'★'.repeat(testimonial.rating)}
                {'☆'.repeat(5 - testimonial.rating)}
              </div>

              <p className="text-sm md:text-base italic">{testimonial.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}