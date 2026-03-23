import { Button } from '@/components/ui/button'
import SignInModal from '@/features/auth/signin-modal'
import { authClient } from '@/lib/auth-client'
import { createFileRoute } from '@tanstack/react-router'
import { LogOut, User } from 'lucide-react'

export const Route = createFileRoute('/demo/auth')({
  component: RouteComponent,
})

function RouteComponent() {
    const session = authClient.useSession()


    const handleLogout = async () => {
        try {
            await authClient.signOut()
        } catch (err) {
            console.error('Logout failed:', err)
        }
    }

    if (session.isPending) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
        )
    }

    if (session.data) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                            <User className="w-6 h-6 text-green-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Welcome!</h1>
                        <p className="text-gray-600 mt-2">You're logged in</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
                        <p className="text-sm text-gray-600">
                            <strong>Email:</strong> {session.data.user.email}
                        </p>
                        {session.data.user.name && (
                            <p className="text-sm text-gray-600">
                                <strong>Name:</strong> {session.data.user.name}
                            </p>
                        )}
                        <p className="text-sm text-gray-600">
                            <strong>ID:</strong> {session.data.user.id.substring(0, 8)}...
                        </p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
                    >
                        <LogOut className="w-4 h-4" />
                        Log Out
                    </button>
                </div>
            </div>
        )
    }

    // Show modal when not logged in
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Authentication Required</h1>
                <p className="text-gray-600 mb-6">Please sign in to continue</p>

                <SignInModal>
                    <Button className="w-full">Sign In</Button>
                </SignInModal>
            </div>
        </div>
    )
}
