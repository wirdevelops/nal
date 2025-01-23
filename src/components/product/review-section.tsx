'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Star } from 'lucide-react'

interface ReviewSectionProps {
  productId: number
  reviews: Array<{
    id: number
    userId: number
    username: string
    rating: number
    comment: string
    date: string
  }>
}

export function ReviewSection({ productId, reviews }: ReviewSectionProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const addReview = useAppStore((state) => state.addReview)

  const handleSubmitReview = () => {
    if (rating === 0 || comment.trim() === '') return

    addReview(productId, {
      userId: 1, // In a real app, this would be the current user's ID
      username: 'Current User', // In a real app, this would be the current user's name
      rating,
      comment,
      date: new Date().toISOString().split('T')[0]
    })

    setRating(0)
    setComment('')
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-[#1a472a] mb-4">Customer Reviews</h2>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-4">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="font-semibold">{review.username}</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{review.date}</p>
            <p className="mt-2">{review.comment}</p>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
        <div className="flex mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className="focus:outline-none"
            >
              <Star
                className={`h-6 w-6 ${
                  star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review here..."
          className="mb-4"
        />
        <Button onClick={handleSubmitReview}>Submit Review</Button>
      </div>
    </div>
  )
}

