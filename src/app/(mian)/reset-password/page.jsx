import React, { Suspense } from 'react'
import ResetPassword from '../../../components/auth/ResetPassword'

const page = () => {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <ResetPassword />
    </Suspense>
  )
}

export default page
