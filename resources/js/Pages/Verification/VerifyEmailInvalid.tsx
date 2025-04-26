import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { Head, useForm } from "@inertiajs/react"
import { XCircle } from "lucide-react"
import { Button } from "@/Components/ui/button";

interface VerifyEmailInvalidProps {
  id: number;
}

const VerifyEmailInvalid = ({id} : VerifyEmailInvalidProps) => {

  const { post, data } = useForm({
    id: id
  });

  return (
    <><div className="flex items-center justify-center min-h-screen bg-background">
      <Head title="Email Verification Failed" />
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <XCircle className="w-16 h-16 text-red-500 animate-wrong" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Email Verified!</CardTitle>
        </CardHeader>

        <CardContent className="text-center flex flex-col items-center">
          <p className="text-muted-foreground text-center mb-4">
            We're sorry, but the verification link you used is invalid or has expired.
          </p>

          <p className="text-foreground font-semibold text-center">
            Please request a new verification email or contact support for assistance.
          </p>

          <form className="mt-5" onSubmit={(e) => {
            e.preventDefault();
            post(route('verification.send.api', id));
          } }>
            <Button>Resend Verification Email</Button>
          </form>
        </CardContent>

    </Card><style>{`
        @keyframes wrong {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-wrong {
          animation: wrong 0.5s ease-in-out;
        }
      `}</style>
    </div>
    </>
  )
}

export default VerifyEmailInvalid
