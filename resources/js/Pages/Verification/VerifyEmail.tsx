import { CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { Head } from "@inertiajs/react"

const VerifyEmail = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Head title="Email Verified!" />
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500 animate-check" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Email Verified!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center mb-4">
            Your email has been successfully verified. Thank you for confirming your account.
          </p>
          <p className="text-foreground font-semibold text-center">You can now log in using our mobile app.</p>
        </CardContent>
      </Card>
      <style>{`
        @keyframes check {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-check {
          animation: check 0.5s ease-in-out;
        }
      `}</style>
    </div>
  )
}

export default VerifyEmail

