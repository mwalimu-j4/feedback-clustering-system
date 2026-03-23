import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button, buttonVariants } from "@/components/ui/button"
import { LoadingSwap } from "@/components/ui/loading-swap"
import useModalState from "@/hooks/use-modal-state"
import useRedirectUrl from "@/hooks/use-redirect-url"
import { authClient } from "@/lib/auth-client"
import { Link } from "@tanstack/react-router"
import * as React from "react"
import { toast } from "sonner"


interface SignInModalProps {
    children: React.ReactNode;
}

export default function SignInModal({ children }: SignInModalProps) {

    const { isOpen, openModal, closeModal } = useModalState({
        paramName: "sign-in-modal",
        openValue: "open",
    });

    const {
        redirectUrl
    } = useRedirectUrl()

    const [isLoading, setIsLoading] = React.useState(false)

    const handleGoogleSignIn = async () => {
        setIsLoading(true)

        try {
            const result = await authClient.signIn.social({
                provider: "google",
                callbackURL: redirectUrl,
            })

            if (result.error) {
                toast.error(result.error.message || "Failed to sign in with Google")
                setIsLoading(false)
                return
            }

        } catch {
            toast.error("An unexpected error occurred while signing in with Google")
            setIsLoading(false)
        } finally {
        }
    }

    const handleOpenChange = (newOpen: boolean) => {
        if (newOpen) {
            openModal();
        } else {
            closeModal();
        }
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
            {children && <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>}
            <AlertDialogContent className="sm:max-w-md">
                <AlertDialogHeader className="space-y-3 text-center sm:text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <svg
                            className="h-6 w-6 text-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                            />
                        </svg>
                    </div>
                    <AlertDialogTitle className="text-2xl font-semibold tracking-tight">
                        Welcome
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-base text-muted-foreground">
                        Sign in to your account to continue.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-4 py-6">
                    <Button
                        variant="outline"
                        size="lg"
                        className="w-full h-11 relative group hover:bg-accent hover:text-accent-foreground transition-all duration-200"
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                    >
                        <LoadingSwap isLoading={isLoading}>
                            <div className="flex items-center justify-center gap-3">
                                <svg
                                    className="h-5 w-5 shrink-0"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                <span className="font-medium">Continue with Google</span>
                            </div>
                        </LoadingSwap>
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Secure authentication
                            </span>
                        </div>
                    </div>

                    <p className="text-center text-xs text-muted-foreground">
                        By continuing, you agree to our <Link
                            to="/terms"
                            className={buttonVariants({ variant: "link" }) + " h-auto p-0! text-xs inline"}
                        >Terms of Service</Link> and <Link
                            to="/privacy"
                            className={buttonVariants({ variant: "link" }) + " h-auto p-0! text-xs inline"}
                        >Privacy Policy</Link>
                    </p>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    )
}