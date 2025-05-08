import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/firebase'
import Link from 'next/link'
import { notFound } from 'next/navigation'

async function SocialDetailPage({ params }) {
  // Fetch data directly in the component
  const docRef = doc(db, 'posts', params.id)
  const docSnap = await getDoc(docRef)

  if (!docSnap.exists()) {
    notFound()
  }

  const post = docSnap.data()

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{post.title}</h2>
      <p className="mb-4">{post.content}</p>
      <Link 
        href="/social"
        className="text-blue-500 hover:text-blue-700"
      >
        Back to list
      </Link>
    </div>
  )
}

// Generate static params (replaces getStaticPaths)
export async function generateStaticParams() {
  // If you want to statically generate some paths at build time
  // you can fetch the IDs here and return them
  return []
}

export default SocialDetailPage