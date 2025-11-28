import stripe
from app.core.config import settings

class PaymentService:
    def __init__(self):
        stripe.api_key = settings.STRIPE_SECRET_KEY

    async def create_checkout_session(self, course_id: int, course_title: str, price: float, user_id: int):
        try:
            # In a real app, we would use a proper success_url and cancel_url
            # For this prototype, we'll redirect back to the course page or a success page
            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[{
                    'price_data': {
                        'currency': 'usd',
                        'product_data': {
                            'name': course_title,
                        },
                        'unit_amount': int(price * 100),  # Stripe expects amount in cents
                    },
                    'quantity': 1,
                }],
                mode='payment',
                success_url=f'http://localhost:3000/learn/{course_id}?success=true',
                cancel_url=f'http://localhost:3000/courses/{course_id}?canceled=true',
                metadata={
                    'course_id': str(course_id),
                    'user_id': str(user_id)
                }
            )
            return checkout_session.url
        except Exception as e:
            print(f"Error creating checkout session: {e}")
            raise e

payment_service = PaymentService()
